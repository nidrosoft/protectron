-- Phase 4C: Add chat_history column to quick_comply_sessions for resume capability
-- Stores the full AI SDK message array as JSONB for session restoration

ALTER TABLE public.quick_comply_sessions
  ADD COLUMN IF NOT EXISTS chat_history jsonb DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.quick_comply_sessions.chat_history IS 'Serialized chat messages (AI SDK UIMessage format) for session resume';

-- Optimize: Add index for sessions lookup by user + status (for dashboard banner)
CREATE INDEX IF NOT EXISTS idx_quick_comply_sessions_user_status 
  ON public.quick_comply_sessions(user_id, status, updated_at DESC);
