-- Add availabilities column to teams table
ALTER TABLE teams ADD COLUMN availabilities JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN teams.availabilities IS 'JSON array of ISO date strings representing team availability';
