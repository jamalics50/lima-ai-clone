'use client';

import React, { useEffect, useState } from 'react';

export function HashErrorNotice() {
  const [hashMessage, setHashMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const desc = params.get('error_description');
      const errCode = params.get('error_code');

      if (desc || errCode) {
        if (errCode === 'otp_expired' || desc?.toLowerCase().includes('expired')) {
          setHashMessage('This verification link has expired or was already used. Please request a new confirmation email or sign in below.');
        } else if (desc) {
          setHashMessage(decodeURIComponent(desc.replace(/\+/g, ' ')));
        }
      }
    }
  }, []);

  if (!hashMessage) return null;

  return (
    <div className="p-3 text-center text-xs rounded-xl border bg-amber-50 text-amber-800 border-amber-200 mb-3 font-sans">
      {hashMessage}
    </div>
  );
}
