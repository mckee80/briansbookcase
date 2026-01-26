'use client';

import { useState } from 'react';
import { X, Mail, CheckCircle, RefreshCw } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export default function EmailVerificationModal({
  isOpen,
  onClose,
  email,
}: EmailVerificationModalProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [resendMessage, setResendMessage] = useState('');

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendStatus('idle');
    setResendMessage('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        setResendStatus('error');
        setResendMessage(error.message);
      } else {
        setResendStatus('success');
        setResendMessage('Verification email sent! Check your inbox.');
      }
    } catch {
      setResendStatus('error');
      setResendMessage('Failed to resend email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold font-garamond text-primary">
            Verify Your Email
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="text-center py-4">
          <div className="mb-4 text-accent">
            <Mail size={64} className="mx-auto" />
          </div>

          <p className="font-crimson text-lg text-gray-800 mb-4">
            We&apos;ve sent a verification email to:
          </p>

          <p className="font-crimson text-lg font-semibold text-primary mb-6 break-all">
            {email}
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="font-crimson text-sm text-gray-700 mb-3">
              <strong>Important:</strong> You must verify your email before you can access the library.
            </p>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                <p className="font-crimson text-sm text-gray-700">
                  Check your inbox for an email from <strong>Supabase Auth</strong>
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                <p className="font-crimson text-sm text-gray-700">
                  Click the verification link in the email
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                <p className="font-crimson text-sm text-gray-700">
                  Return here to log in and access the library
                </p>
              </div>
            </div>
          </div>

          <p className="font-crimson text-xs text-gray-500 mb-4">
            Can&apos;t find the email? Check your spam folder or wait a few minutes for it to arrive.
          </p>

          {/* Resend Status Message */}
          {resendStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="font-crimson text-sm text-green-700">{resendMessage}</p>
            </div>
          )}
          {resendStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="font-crimson text-sm text-red-700">{resendMessage}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full px-4 py-3 bg-gray-100 text-primary rounded-lg hover:bg-gray-200 transition-colors font-crimson font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={18} className={isResending ? 'animate-spin' : ''} />
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </button>

            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-accent text-white rounded-lg hover:bg-primary transition-colors font-crimson font-semibold"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
