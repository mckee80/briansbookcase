'use client';

import { useState, useEffect } from 'react';
import { X, Send, Mail } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SendToDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  ebookId: number;
  ebookTitle: string;
  userId: string;
  onSendComplete?: (ebookId: number) => void;
}

export default function SendToDeviceModal({
  isOpen,
  onClose,
  ebookId,
  ebookTitle,
  userId,
  onSendComplete,
}: SendToDeviceModalProps) {
  const [deviceEmail, setDeviceEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load saved device email from user metadata
  useEffect(() => {
    const loadDeviceEmail = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata?.device_email) {
          setDeviceEmail(user.user_metadata.device_email);
        }
      } catch (err) {
        console.error('Failed to load device email:', err);
      }
    };

    if (isOpen) {
      loadDeviceEmail();
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/send-ebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ebookId,
          deviceEmail,
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send ebook');
      }

      setSuccess(true);

      // Call the tracking callback
      if (onSendComplete) {
        onSendComplete(ebookId);
      }

      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send ebook');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold font-garamond text-primary">
            Send to Device
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="mb-4 text-green-600">
              <Mail size={48} className="mx-auto" />
            </div>
            <p className="font-crimson text-lg text-gray-800 mb-2">
              Email sent successfully!
            </p>
            <p className="font-crimson text-sm text-gray-600">
              Check your inbox for <strong>{ebookTitle}</strong>
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-crimson text-sm text-gray-700 leading-relaxed">
                <strong>How it works:</strong> We&apos;ll email <strong>{ebookTitle}</strong> directly to your device.
                You can use your Kindle email (e.g., <em>yourname@kindle.com</em>), your phone&apos;s email,
                or any email address where you want to receive the ebook.
              </p>
            </div>

            <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-300">
              <p className="font-crimson text-sm text-gray-800 leading-relaxed mb-2">
                <strong>📖 Kindle Users:</strong> To receive ebooks on your Kindle, you must add{' '}
                <strong className="text-primary">library@mail.briansbookcase.org</strong> to your approved personal document email list.
              </p>
              <a
                href="https://www.amazon.com/gp/help/customer/display.html?nodeId=GX9XLEVV8G4DB28H"
                target="_blank"
                rel="noopener noreferrer"
                className="font-crimson text-sm text-accent hover:text-primary underline"
              >
                Click here for instructions on adding approved emails →
              </a>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="deviceEmail"
                  className="block font-crimson text-sm font-medium text-gray-700 mb-2"
                >
                  Device Email Address
                </label>
                <input
                  type="email"
                  id="deviceEmail"
                  value={deviceEmail}
                  onChange={(e) => setDeviceEmail(e.target.value)}
                  placeholder="your.device@kindle.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-crimson"
                  disabled={loading}
                />
                <p className="mt-2 font-crimson text-xs text-gray-500">
                  This email will be saved for future downloads
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="font-crimson text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-crimson text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-primary transition-colors font-crimson flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !deviceEmail}
                >
                  {loading ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Ebook
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
