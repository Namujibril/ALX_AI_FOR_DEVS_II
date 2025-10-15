// Database types for the polling app

export interface PollOption {
  id: string;
  option_text: string;
  poll_id?: string;
}

export interface Poll {
  id: string;
  title: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface PollWithOptions extends Poll {
  options: PollOption[];
}

// For editing polls - allows new options without IDs
export interface EditablePollOption {
  id: string;
  option_text: string;
}

export interface EditablePoll {
  title: string;
  options: EditablePollOption[];
}

// For creating new polls
export interface CreatePollData {
  title: string;
  options: Omit<PollOption, 'id' | 'poll_id'>[];
}

// For updating polls
export interface UpdatePollData {
  title: string;
  options: PollOption[];
}
