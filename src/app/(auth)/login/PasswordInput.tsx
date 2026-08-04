'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        id="password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        required
        className="flex h-10 w-full rounded-xl border border-black/10 bg-zinc-50/50 px-3.5 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-coral/50 focus-visible:ring-1 focus-visible:ring-coral/50 transition-all"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
