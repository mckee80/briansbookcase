'use client';

import { X, Mail, CheckCircle } from 'lucide-react';

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

          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-accent text-white rounded-lg hover:bg-primary transition-colors font-crimson font-semibold"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
