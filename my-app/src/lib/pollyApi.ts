export interface PollyRegisterRequest {
  username: string
  password: string
}

export interface PollyRegisterResponse {
  // Adjust based on server response; fall back to generic index signature
  [key: string]: unknown
}

export interface PollyPollItem {
  // Minimal shape based on README; keep open for server fields
  id?: number
  question?: string
  options?: { id?: number; text?: string; vote_count?: number }[]
  [key: string]: unknown
}

export interface PollyFetchPollsResponse {
  // Some APIs return an array directly; keep both possibilities ergonomic
  data?: PollyPollItem[]
  items?: PollyPollItem[]
  results?: PollyPollItem[]
  [key: string]: unknown
}

/** Default request timeout in milliseconds for Polly API calls. */
const DEFAULT_TIMEOUT_MS = 10000

/**
 * Resolve Polly API base URL from env or fall back to local default.
 * Returns base URL without a trailing slash.
 */
function getBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_POLLY_API_BASE_URL
  if (fromEnv && fromEnv.trim().length > 0) return fromEnv.replace(/\/$/, '')
  // Local default from the Polly-API README
  return 'http://127.0.0.1:8000'
}

/**
 * Wrap a promise with a timeout that rejects after `timeoutMs`.
 */
async function withTimeout<T>(promise: Promise<T>, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  let timeoutId: NodeJS.Timeout
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Request timed out')), timeoutMs)
  })
  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    clearTimeout(timeoutId!)
  }
}

/**
 * Register a new user against Polly API.
 * POST /register with JSON body { username, password }.
 *
 * @param payload - Registration credentials for the new user
 * @param init - Optional fetch init overrides (e.g., headers)
 * @returns Parsed server response
 * @throws Error when network fails or response is non-2xx
 */
export async function registerUserViaPolly(
  payload: PollyRegisterRequest,
  init?: RequestInit,
): Promise<PollyRegisterResponse> {
  const url = `${getBaseUrl()}/register`
  const response = await withTimeout(
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(init?.headers ?? {}),
      },
      body: JSON.stringify(payload),
      ...init,
    })
  )

  const text = await response.text()
  let json: unknown
  try {
    json = text ? JSON.parse(text) : {}
  } catch {
    json = { raw: text }
  }

  if (!response.ok) {
    const err = typeof json === 'object' && json !== null ? json : { error: text }
    throw new Error(`Polly register failed (${response.status}): ${JSON.stringify(err)}`)
  }

  return (json as PollyRegisterResponse)
}

export interface FetchPollsParams {
  skip?: number
  limit?: number
}

/**
 * Fetch paginated polls.
 * GET /polls with optional query params { skip, limit }.
 *
 * @param params - Pagination parameters
 * @param init - Optional fetch init overrides
 * @returns Object containing array of polls and HTTP status code
 * @throws Error when network fails or response is non-2xx
 */
export async function fetchPollsViaPolly(
  params?: FetchPollsParams,
  init?: RequestInit,
): Promise<{ data: PollyPollItem[]; status: number }> {
  const url = new URL(`${getBaseUrl()}/polls`)
  if (typeof params?.skip === 'number') url.searchParams.set('skip', String(params.skip))
  if (typeof params?.limit === 'number') url.searchParams.set('limit', String(params.limit))

  const response = await withTimeout(
    fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(init?.headers ?? {}),
      },
      ...init,
    })
  )

  const text = await response.text()
  let json: unknown
  try {
    json = text ? JSON.parse(text) : []
  } catch {
    json = { raw: text }
  }

  if (!response.ok) {
    throw new Error(`Polly fetch polls failed (${response.status}): ${typeof json === 'string' ? json : JSON.stringify(json)}`)
  }

  let items: PollyPollItem[]
  if (Array.isArray(json)) {
    items = json as PollyPollItem[]
  } else if (json && typeof json === 'object') {
    const obj = json as PollyFetchPollsResponse
    items = obj.data || obj.items || obj.results || []
    if (!Array.isArray(items)) items = []
  } else {
    items = []
  }

  return { data: items, status: response.status }
}

export interface VoteOnPollRequest {
  option_id: number
}

export interface VoteOnPollResponse {
  // Adjust if server returns a defined schema
  [key: string]: unknown
}

/**
 * Cast a vote on a poll option.
 * POST /polls/{pollId}/vote with JSON body { option_id }.
 *
 * @param pollId - Numeric poll identifier
 * @param optionId - Option identifier to vote for
 * @param accessToken - Optional Bearer token for authenticated request
 * @param init - Optional fetch init overrides
 * @returns Parsed server response
 * @throws Error when network fails or response is non-2xx
 */
export async function voteOnPollViaPolly(
  pollId: number,
  optionId: number,
  accessToken?: string,
  init?: RequestInit,
): Promise<VoteOnPollResponse> {
  const url = `${getBaseUrl()}/polls/${encodeURIComponent(String(pollId))}/vote`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(init?.headers as Record<string, string> | undefined),
  }
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`

  const response = await withTimeout(
    fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ option_id: optionId } satisfies VoteOnPollRequest),
      ...init,
    })
  )

  const text = await response.text()
  let json: unknown
  try {
    json = text ? JSON.parse(text) : {}
  } catch {
    json = { raw: text }
  }

  if (!response.ok) {
    const err = typeof json === 'object' && json !== null ? json : { error: text }
    throw new Error(`Polly vote failed (${response.status}): ${JSON.stringify(err)}`)
  }

  return (json as VoteOnPollResponse)
}

export interface PollResultsItem {
  option_id: number
  text: string
  vote_count: number
}

export interface PollResultsResponse {
  poll_id: number
  question: string
  results: PollResultsItem[]
}

/**
 * Retrieve poll results including per-option vote counts.
 * GET /polls/{pollId}/results.
 *
 * @param pollId - Numeric poll identifier
 * @param init - Optional fetch init overrides
 * @returns Results payload with poll metadata and options summary
 * @throws Error when network fails or response is non-2xx
 */
export async function getPollResultsViaPolly(
  pollId: number,
  init?: RequestInit,
): Promise<PollResultsResponse> {
  const url = `${getBaseUrl()}/polls/${encodeURIComponent(String(pollId))}/results`
  const response = await withTimeout(
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(init?.headers ?? {}),
      },
      ...init,
    })
  )

  const text = await response.text()
  let json: unknown
  try {
    json = text ? JSON.parse(text) : {}
  } catch {
    json = { raw: text }
  }

  if (!response.ok) {
    const err = typeof json === 'object' && json !== null ? json : { error: text }
    throw new Error(`Polly poll results failed (${response.status}): ${JSON.stringify(err)}`)
  }

  return (json as PollResultsResponse)
}



