-- Phase 5A: Add RPC function for atomic token increment
-- This ensures thread-safe token usage tracking

CREATE OR REPLACE FUNCTION public.increment_tokens(org_id uuid, token_count integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.organizations
  SET 
    tokens_used_this_month = COALESCE(tokens_used_this_month, 0) + token_count,
    -- Auto-reset if we're in a new month
    token_reset_date = CASE
      WHEN token_reset_date IS NULL OR token_reset_date < date_trunc('month', now())
      THEN date_trunc('month', now()) + interval '1 month'
      ELSE token_reset_date
    END
  WHERE id = org_id;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.increment_tokens(uuid, integer) TO authenticated;
