import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
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
    <div 
      className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden text-foreground"
      style={{ background: 'var(--gradient-hero)' }}
    >
      <div className="w-full max-w-[380px] relative z-10 flex flex-col items-center">
        {/* Title and subtitle outside the card */}
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-white shadow-soft flex items-center justify-center mb-6">
            <span className="text-xl font-serif font-bold text-coral">L</span>
          </div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-foreground mb-2">Login</h1>
          <p className="text-muted-foreground text-sm font-sans">
            Don&apos;t have an account?{' '}
            <button formAction={signUp} className="text-foreground font-medium hover:underline focus:outline-none">
              Sign up
            </button>
          </p>
        </div>

        {/* Floating white card */}
        <Card className="w-full p-6 bg-white shadow-float rounded-[24px] border-none">
          <CardContent className="p-0 space-y-6">
            <form action={signInWithGoogle}>
              <Button type="submit" variant="outline" className="w-full h-12 rounded-xl text-[15px] bg-white border-black/5 shadow-sm hover:bg-zinc-50 text-foreground flex items-center justify-center gap-3 font-medium">
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                  <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                  <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                  <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                </svg>
                Login with Google
              </Button>
            </form>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-black/5"></div>
              <span className="flex-shrink mx-4 text-xs font-medium text-muted-foreground">or</span>
              <div className="flex-grow border-t border-black/5"></div>
            </div>

            <form className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-sans font-medium text-muted-foreground ml-1">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="flex h-12 w-full rounded-xl border border-black/5 bg-zinc-50/50 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-coral/50 focus-visible:ring-1 focus-visible:ring-coral/50 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-sans font-medium text-muted-foreground ml-1">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="flex h-12 w-full rounded-xl border border-black/5 bg-zinc-50/50 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-coral/50 focus-visible:ring-1 focus-visible:ring-coral/50 transition-all"
                />
              </div>
              <div className="pt-2">
                <Button formAction={signIn} variant="primary" className="w-full h-12 rounded-xl text-[15px]">
                  Sign In
                </Button>
              </div>
            </form>

            {searchParams?.message && (
              <p className="p-3 bg-red-50 text-red-600 border border-red-100 text-center text-sm rounded-xl">
                {searchParams.message}
              </p>
            )}
          </CardContent>
        </Card>
        
        {/* Footer links */}
        <div className="mt-8 text-center text-xs text-muted-foreground space-y-2 font-sans">
          <p>By logging in, you agree to our Terms of Service</p>
        </div>
      </div>
    </div>
  );
}
