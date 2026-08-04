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
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Premium ambient glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-coral/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-sky/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <Card className="w-full max-w-[420px] p-2 bg-card/80 backdrop-blur-xl border-white/10 shadow-2xl relative z-10 rounded-[24px]">
        <CardHeader className="space-y-2 pb-6 pt-4 text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-coral/10 border border-coral/20 flex items-center justify-center mb-4">
            <span className="text-xl font-serif font-bold text-coral">L</span>
          </div>
          <CardTitle className="text-2xl font-serif font-medium tracking-tight text-foreground">LIMA AI</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form className="space-y-4">
            <div className="space-y-2 text-left">
              <label
                htmlFor="email"
                className="text-xs font-sans font-medium text-foreground ml-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                className="flex h-11 w-full rounded-xl border border-white/10 bg-background/50 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-coral/50 focus-visible:ring-1 focus-visible:ring-coral/50 shadow-sm transition-all"
              />
            </div>
            <div className="space-y-2 text-left">
              <label
                htmlFor="password"
                className="text-xs font-sans font-medium text-foreground ml-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="flex h-11 w-full rounded-xl border border-white/10 bg-background/50 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-coral/50 focus-visible:ring-1 focus-visible:ring-coral/50 shadow-sm transition-all"
              />
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <Button formAction={signIn} variant="primary" className="w-full h-11 rounded-xl text-base shadow-lg shadow-coral/20">
                Sign In
              </Button>
              <Button formAction={signUp} variant="outline" className="w-full h-11 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-foreground">
                Sign Up
              </Button>
            </div>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Or</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <form action={signInWithGoogle}>
            <Button type="submit" variant="outline" className="w-full h-11 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-foreground flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                  fill="#EA4335"
                />
                <path
                  d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                  fill="#4285F4"
                />
                <path
                  d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                  fill="#34A853"
                />
              </svg>
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
