-- Phase 1C: Quick Comply Sessions Table
-- Stores all Quick Comply chat session data including form responses, chat history, and generated outputs

CREATE TABLE IF NOT EXISTS quick_comply_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  ai_system_id UUID REFERENCES ai_systems(id) ON DELETE SET NULL,
  
  -- Session state
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  current_section TEXT DEFAULT 'welcome',
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  
  -- Collected data (JSONB for flexible schema)
  form_data JSONB DEFAULT '{}'::jsonb,
  sections_completed JSONB DEFAULT '[]'::jsonb,
  
  -- Chat history for resume capability
  chat_messages JSONB DEFAULT '[]'::jsonb,
  
  -- Generated outputs
  risk_classification TEXT CHECK (risk_classification IN ('prohibited', 'high', 'limited', 'minimal', NULL)),
  applicable_articles JSONB DEFAULT '[]'::jsonb,
  documents_generated JSONB DEFAULT '[]'::jsonb,
  
  -- Subscription & usage tracking
  subscription_tier TEXT DEFAULT 'free',
  tokens_used INTEGER DEFAULT 0,
  
  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE quick_comply_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their org quick comply sessions"
  ON quick_comply_sessions FOR SELECT
  USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can create quick comply sessions for their org"
  ON quick_comply_sessions FOR INSERT
  WITH CHECK (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their own quick comply sessions"
  ON quick_comply_sessions FOR UPDATE
  USING (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_qc_sessions_org_id ON quick_comply_sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_qc_sessions_user_id ON quick_comply_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_qc_sessions_status ON quick_comply_sessions(status);
CREATE INDEX IF NOT EXISTS idx_qc_sessions_ai_system_id ON quick_comply_sessions(ai_system_id);
CREATE INDEX IF NOT EXISTS idx_qc_sessions_last_activity ON quick_comply_sessions(last_activity_at);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_quick_comply_sessions_updated_at()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_quick_comply_sessions_updated_at
  BEFORE UPDATE ON quick_comply_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_quick_comply_sessions_updated_at();
