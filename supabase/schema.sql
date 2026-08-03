-- Schema for LIMA AI-CLONE

-- 1. Create the workspaces table
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the workspace_members table
CREATE TABLE IF NOT EXISTS public.workspace_members (
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    PRIMARY KEY (workspace_id, user_id)
);

-- 3. Enable RLS
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for workspaces
-- Users can view workspaces they are a member of
CREATE POLICY "Users can view their own workspaces" ON public.workspaces
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_id = workspaces.id
            AND user_id = auth.uid()
        )
    );

-- 5. RLS Policies for workspace_members
-- Users can view members of their own workspaces
CREATE POLICY "Users can view members of their workspaces" ON public.workspace_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members wm
            WHERE wm.workspace_id = workspace_members.workspace_id
            AND wm.user_id = auth.uid()
        )
    );

-- 6. Trigger to auto-create a workspace for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_workspace_id UUID;
BEGIN
  -- Insert a default workspace
  INSERT INTO public.workspaces (name)
  VALUES (COALESCE(new.raw_user_meta_data->>'full_name', new.email, 'My Workspace'))
  RETURNING id INTO new_workspace_id;

  -- Add the user as the owner of the new workspace
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace_id, new.id, 'owner');

  RETURN new;
END;
$$;

-- Trigger to call the function when a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
