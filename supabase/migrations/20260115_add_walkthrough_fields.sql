-- Add walkthrough tracking fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS walkthrough_status TEXT DEFAULT 'not_started',
ADD COLUMN IF NOT EXISTS walkthrough_step INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS walkthrough_completed_steps JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS first_ai_system_id UUID REFERENCES ai_systems(id);

-- Add index for quick lookups
CREATE INDEX IF NOT EXISTS idx_profiles_walkthrough_status ON profiles(walkthrough_status);

-- Add comment for documentation
COMMENT ON COLUMN profiles.walkthrough_status IS 'Status of the first-time user walkthrough: not_started, in_progress, completed, skipped';
COMMENT ON COLUMN profiles.walkthrough_step IS 'Current step in the walkthrough (0-10)';
COMMENT ON COLUMN profiles.walkthrough_completed_steps IS 'Array of completed step numbers';
COMMENT ON COLUMN profiles.onboarding_completed IS 'Whether the user has completed initial onboarding';
COMMENT ON COLUMN profiles.first_ai_system_id IS 'Reference to the first AI system created during walkthrough';
