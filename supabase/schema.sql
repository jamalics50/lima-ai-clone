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
DROP POLICY IF EXISTS "Users can view their own workspaces" ON public.workspaces;
CREATE POLICY "Users can view their own workspaces" ON public.workspaces
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members
            WHERE workspace_id = workspaces.id
            AND user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can create workspaces" ON public.workspaces;
CREATE POLICY "Users can create workspaces" ON public.workspaces
    FOR INSERT WITH CHECK (true);


-- 5. RLS Policies for workspace_members
-- Users can view members of their own workspaces
DROP POLICY IF EXISTS "Users can view members of their workspaces" ON public.workspace_members;
CREATE POLICY "Users can view members of their workspaces" ON public.workspace_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members wm
            WHERE wm.workspace_id = workspace_members.workspace_id
            AND wm.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert themselves into workspaces" ON public.workspace_members;
CREATE POLICY "Users can insert themselves into workspaces" ON public.workspace_members
    FOR INSERT WITH CHECK (auth.uid() = user_id);

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

-- 7. Create the brands table
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Create the competitors table
CREATE TABLE IF NOT EXISTS public.competitors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Create the prompts table
CREATE TABLE IF NOT EXISTS public.prompts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Create the platform_runs table
CREATE TABLE IF NOT EXISTS public.platform_runs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE,
    platform_name TEXT NOT NULL,
    response_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Create the mentions table
CREATE TABLE IF NOT EXISTS public.mentions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform_run_id UUID REFERENCES public.platform_runs(id) ON DELETE CASCADE,
    mentioned_brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
    mentioned_competitor_id UUID REFERENCES public.competitors(id) ON DELETE CASCADE,
    sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Create the citations table
CREATE TABLE IF NOT EXISTS public.citations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform_run_id UUID REFERENCES public.platform_runs(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on new tables
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citations ENABLE ROW LEVEL SECURITY;

-- Helper function to check workspace access
CREATE OR REPLACE FUNCTION public.user_has_workspace_access(ws_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = ws_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for new tables

-- brands
DROP POLICY IF EXISTS "Users can access their workspace brands" ON public.brands;
CREATE POLICY "Users can access their workspace brands" ON public.brands
    FOR ALL USING (public.user_has_workspace_access(workspace_id));

-- competitors
DROP POLICY IF EXISTS "Users can access their workspace competitors" ON public.competitors;
CREATE POLICY "Users can access their workspace competitors" ON public.competitors
    FOR ALL USING (public.user_has_workspace_access(workspace_id));

-- prompts
DROP POLICY IF EXISTS "Users can access their workspace prompts" ON public.prompts;
CREATE POLICY "Users can access their workspace prompts" ON public.prompts
    FOR ALL USING (public.user_has_workspace_access(workspace_id));

-- platform_runs (access via prompt's workspace)
DROP POLICY IF EXISTS "Users can access their workspace platform_runs" ON public.platform_runs;
CREATE POLICY "Users can access their workspace platform_runs" ON public.platform_runs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.prompts p
            WHERE p.id = platform_runs.prompt_id
            AND public.user_has_workspace_access(p.workspace_id)
        )
    );

-- mentions (access via platform_run's prompt's workspace)
DROP POLICY IF EXISTS "Users can access their workspace mentions" ON public.mentions;
CREATE POLICY "Users can access their workspace mentions" ON public.mentions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.platform_runs pr
            JOIN public.prompts p ON p.id = pr.prompt_id
            WHERE pr.id = mentions.platform_run_id
            AND public.user_has_workspace_access(p.workspace_id)
        )
    );

-- citations (access via platform_run's prompt's workspace)
DROP POLICY IF EXISTS "Users can access their workspace citations" ON public.citations;
CREATE POLICY "Users can access their workspace citations" ON public.citations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.platform_runs pr
            JOIN public.prompts p ON p.id = pr.prompt_id
            WHERE pr.id = citations.platform_run_id
            AND public.user_has_workspace_access(p.workspace_id)
        )
    );
