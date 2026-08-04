import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { FloatingHeader } from '@/app/(app)/FloatingHeader';
import { PasswordInput } from './PasswordInput';
import { HashErrorNotice } from './HashErrorNotice';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message?: string; mode?: string }
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect('/');
  }

  const isSignUp = searchParams?.mode === 'signup';
  const message = searchParams?.message;

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
      return redirect(`/login?mode=login&message=${encodeURIComponent(error.message)}`);
    }

    return redirect('/');
  };

  const signUp = async (formData: FormData) => {
    'use server';
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect(`/login?mode=signup&message=${encodeURIComponent(error.message)}`);
    }

    if (data?.session) {
      return redirect('/');
    }

    return redirect('/login?mode=login&message=Account created! Please check your email to verify or sign in.');
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
      return redirect(`/login?message=${encodeURIComponent(error.message)}`);
    }

    if (data?.url) {
      return redirect(data.url);
    }
  };

  return (
    <div 
      className="h-screen max-h-screen overflow-hidden flex flex-col justify-between items-center p-4 relative text-foreground"
      style={{ background: 'var(--gradient-hero)' }}
    >
      {/* Floating top header (compact, non-overlapping) */}
      <FloatingHeader />
      
      {/* Centered Auth Card Container - strictly fits inside 100vh without scrolling */}
      <div className="w-full max-w-[360px] relative z-10 flex flex-col items-center my-auto pt-16">
        {/* Title and Mode Switcher */}
        <div className="text-center mb-5">
          <h1 className="text-2xl font-serif font-medium tracking-tight text-foreground mb-1.5">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h1>
          <p className="text-muted-foreground text-xs font-sans">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <Link href="/login?mode=login" className="text-foreground font-semibold hover:underline">
                  Log in
                </Link>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <Link href="/login?mode=signup" className="text-foreground font-semibold hover:underline">
                  Sign up
                </Link>
              </>
            )}
          </p>
        </div>

        {/* Floating white card */}
        <Card className="w-full p-5 bg-white shadow-float rounded-[24px] border border-black/5">
          <CardContent className="p-0 space-y-4">
            {/* Google OAuth Form */}
            <form action={signInWithGoogle}>
              <Button 
                type="submit" 
                variant="outline" 
                className="w-full h-11 rounded-xl text-sm bg-white border-black/10 shadow-sm hover:bg-zinc-50 text-foreground flex items-center justify-center gap-2.5 font-medium"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                  <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                  <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                  <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                </svg>
                {isSignUp ? 'Sign up with Google' : 'Log in with Google'}
              </Button>
            </form>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-black/10"></div>
              <span className="flex-shrink mx-3 text-[11px] font-medium text-muted-foreground uppercase">or</span>
              <div className="flex-grow border-t border-black/10"></div>
            </div>

            {/* Email & Password Form */}
            <form action={isSignUp ? signUp : signIn} className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-sans font-medium text-muted-foreground ml-1">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="flex h-10 w-full rounded-xl border border-black/10 bg-zinc-50/50 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-coral/50 focus-visible:ring-1 focus-visible:ring-coral/50 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="password" className="text-xs font-sans font-medium text-muted-foreground ml-1">Password</label>
                <PasswordInput />
              </div>
              <div className="pt-1">
                <Button type="submit" variant="primary" className="w-full h-11 rounded-xl text-sm font-medium">
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Button>
              </div>
            </form>

            {/* Client-side hash fragment error notice */}
            <HashErrorNotice />

            {/* Status / Message Display */}
            {message && (
              <div className={`p-3 text-center text-xs rounded-xl border ${
                message.toLowerCase().includes('check email') || message.toLowerCase().includes('created')
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-red-50 text-red-600 border-red-200'
              }`}>
                {message}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer info */}
        <p className="mt-4 text-center text-[11px] text-muted-foreground font-sans">
          By continuing, you agree to our Terms of Service &amp; Privacy Policy.
        </p>
      </div>

      <div />
    </div>
  );
}
