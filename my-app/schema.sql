-- Create the polls table
CREATE TABLE polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMPTZ
);

-- Create the poll_options table
CREATE TABLE poll_options (
    id BIGSERIAL PRIMARY KEY,
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL
);

-- Create the votes table
CREATE TABLE votes (
    id BIGSERIAL PRIMARY KEY,
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    poll_option_id BIGINT REFERENCES poll_options(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (poll_id, user_id) -- a user can only vote once per poll
);

CREATE OR REPLACE FUNCTION get_poll_vote_counts(poll_id_param UUID)
RETURNS TABLE(option_id BIGINT, vote_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    poll_option_id,
    COUNT(*) AS vote_count
  FROM
    votes
  WHERE
    poll_id = poll_id_param
  GROUP BY
    poll_option_id;
END;
$$ LANGUAGE plpgsql;