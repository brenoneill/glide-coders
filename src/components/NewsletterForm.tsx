import { useState } from 'react';
import { useFormspree } from '../hooks/useFormspree';

interface NewsletterFormProps {
  headingLevel?: 'h2' | 'h3';
  showTopBorder?: boolean;
}

/**
 * Newsletter signup form component with Formspree integration
 * @param headingLevel - The heading level to use (h2 or h3), defaults to h2
 * @param showTopBorder - Whether to show a top border and padding, defaults to false
 * 
 * Features:
 * - Validates email format
 * - Submits to Formspree for email collection
 * - Shows success/error feedback
 */
export default function NewsletterForm({ 
  headingLevel = 'h2', 
  showTopBorder = false 
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  
  const { status, message, submitForm } = useFormspree({
    onSuccess: () => setEmail(''), // Clear input on success
  });

  const HeadingTag = headingLevel;

  /**
   * Handles newsletter form submission via Formspree
   * @param e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      return;
    }

    await submitForm({ email });
  };

  return (
    <div className={`mt-12 ${showTopBorder ? 'pt-8 border-t border-gray-200 dark:border-gray-700' : ''}`}>
      <div className="bg-gradient-to-r from-pink-50 to-sky-50 dark:from-pink-900/20 dark:to-sky-900/20 rounded-lg p-8">
        <HeadingTag className="text-2xl font-serif font-medium text-gray-800 dark:text-gray-100 mb-2">
          Join the newsletter
        </HeadingTag>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Get the latest articles and insights delivered directly to your inbox.
        </p>
        
        {status === 'success' ? (
          <div className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Thanks for subscribing!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              required
              className="flex-1 px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-4 py-2 text-sm bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white font-medium rounded-md transition-colors whitespace-nowrap disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Subscribing...' : 'Sign up now'}
            </button>
          </form>
        )}
        
        {status === 'error' && message && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

