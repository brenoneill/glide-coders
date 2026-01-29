import { useState } from 'react';

interface UseFormspreeOptions {
  formIdEnvKey?: string;
  fallbackFormIdEnvKey?: string;
  onSuccess?: () => void;
  onError?: () => void;
}

interface UseFormspreeReturn {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  submitForm: (data: Record<string, any>) => Promise<void>;
  resetStatus: () => void;
}

/**
 * Custom hook for submitting forms to Formspree
 * @param options - Configuration options
 * @param options.formIdEnvKey - Environment variable key for the Formspree form ID (defaults to PUBLIC_FORMSPREE_FORM_ID)
 * @param options.fallbackFormIdEnvKey - Optional fallback environment variable key if the primary one is not set
 * @param options.onSuccess - Optional callback to run on successful submission
 * @param options.onError - Optional callback to run on error
 * @returns Object containing status, message, submitForm function, and resetStatus function
 * 
 * Features:
 * - Handles form submission state (idle, loading, success, error)
 * - Manages error messages
 * - Supports custom Formspree form IDs via environment variables
 * - Supports fallback form IDs
 * - Provides callbacks for success and error states
 */
export function useFormspree(options: UseFormspreeOptions = {}): UseFormspreeReturn {
  const { formIdEnvKey = 'PUBLIC_FORMSPREE_FORM_ID', fallbackFormIdEnvKey, onSuccess, onError } = options;
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  /**
   * Submits data to Formspree
   * @param data - The data object to submit to Formspree
   */
  const submitForm = async (data: Record<string, any>) => {
    setStatus('loading');
    setMessage('');

    try {
      let formspreeId: string | undefined;
      
      if (formIdEnvKey === 'PUBLIC_FORMSPREE_FORM_ID') {
        formspreeId = import.meta.env.PUBLIC_FORMSPREE_FORM_ID;
      } else if (formIdEnvKey === 'PUBLIC_FORMSPREE_REACTIONS_FORM_ID') {
        formspreeId = import.meta.env.PUBLIC_FORMSPREE_REACTIONS_FORM_ID;
      } else {
        formspreeId = (import.meta.env as any)[formIdEnvKey];
      }
      
      if (!formspreeId && fallbackFormIdEnvKey) {
        if (fallbackFormIdEnvKey === 'PUBLIC_FORMSPREE_FORM_ID') {
          formspreeId = import.meta.env.PUBLIC_FORMSPREE_FORM_ID;
        } else if (fallbackFormIdEnvKey === 'PUBLIC_FORMSPREE_REACTIONS_FORM_ID') {
          formspreeId = import.meta.env.PUBLIC_FORMSPREE_REACTIONS_FORM_ID;
        } else {
          formspreeId = (import.meta.env as any)[fallbackFormIdEnvKey];
        }
      }
      
      if (!formspreeId) {
        throw new Error(`Formspree form ID not configured (${formIdEnvKey}${fallbackFormIdEnvKey ? ` or ${fallbackFormIdEnvKey}` : ''})`);
      }

      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Success!');
        onSuccess?.();
      } else {
        const responseData = await response.json();
        setStatus('error');
        setMessage(responseData.error || 'Something went wrong. Please try again.');
        onError?.();
      }
    } catch (error) {
      console.error('Formspree submission error:', error);
      setStatus('error');
      setMessage('Failed to submit. Please try again later.');
      onError?.();
    }
  };

  /**
   * Resets the form status back to idle
   */
  const resetStatus = () => {
    setStatus('idle');
    setMessage('');
  };

  return {
    status,
    message,
    submitForm,
    resetStatus,
  };
}

