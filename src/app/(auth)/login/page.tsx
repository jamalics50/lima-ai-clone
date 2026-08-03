import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect('/');
  }

  const signIn = async (formData: FormData) => {
    'use server';
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect('/login?message=Could not authenticate user');
    }

    return redirect('/');
  };

  const signUp = async (formData: FormData) => {
    'use server';
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect('/login?message=Could not authenticate user');
    }

    return redirect('/login?message=Check email to continue sign in process');
  };

  const signInWithGoogle = async () => {
    'use server';
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect('/login?message=Could not authenticate with Google');
    }

    return redirect(data.url);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">LIMA AI</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Button formAction={signIn}>Sign In</Button>
              <Button formAction={signUp} variant="outline">
                Sign Up
              </Button>
            </div>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-xs text-muted-foreground uppercase">Or</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <form action={signInWithGoogle}>
            <Button type="submit" variant="secondary" className="w-full">
              Continue with Google
            </Button>
          </form>

          {searchParams?.message && (
            <p className="mt-4 p-4 bg-muted text-foreground text-center text-sm rounded-md">
              {searchParams.message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
