import { useState } from 'react';
import { useFormspree } from '../hooks/useFormspree';

interface ReactionsProps {
  slug: string;
}

/**
 * Reactions component for collecting emoji feedback on resources
 * @param slug - The resource slug for tracking reactions per resource
 * 
 * Features:
 * - Allows users to select heart, thumbs-up, or thumbs-down emoji
 * - Submits reaction to Formspree for tracking
 * - Shows success/error feedback
 * - Tracks reactions per post using slug
 */
export default function Reactions({ slug }: ReactionsProps) {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  
  const { status, message, submitForm } = useFormspree({
    formIdEnvKey: 'PUBLIC_FORMSPREE_REACTIONS_FORM_ID',
    fallbackFormIdEnvKey: 'PUBLIC_FORMSPREE_FORM_ID',
    onError: () => setSelectedReaction(null),
  });

  const reactions = [
    { emoji: '❤️', label: 'Love it', value: 'heart' },
    { emoji: '👍', label: 'Helpful', value: 'thumbs-up' },
    { emoji: '👎', label: 'Not helpful', value: 'thumbs-down' },
  ];

  /**
   * Handles reaction submission via Formspree
   * @param reactionValue - The reaction type (heart, thumbs-up, thumbs-down)
   */
  const handleReaction = async (reactionValue: string) => {
    setSelectedReaction(reactionValue);
    
    await submitForm({
      reaction: reactionValue,
      slug: slug,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-serif font-medium text-gray-800 dark:text-gray-100 mb-4">
        How did you find this resource?
      </h3>
      
      <div>
        <div className="flex flex-wrap gap-3">
          {reactions.map((reaction) => (
            <button
              key={reaction.value}
              onClick={() => handleReaction(reaction.value)}
              disabled={status === 'loading'}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all
                ${status === 'success' && selectedReaction === reaction.value
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : status === 'loading' && selectedReaction === reaction.value
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 scale-95'
                  : 'border-gray-200 dark:border-gray-700 hover:border-pink-400 dark:hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/10'
                }
                ${status === 'loading' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                ${status === 'success' && selectedReaction !== reaction.value ? 'opacity-50 hover:opacity-100' : ''}
              `}
              aria-label={reaction.label}
              aria-pressed={status === 'success' && selectedReaction === reaction.value}
            >
              <span className="text-2xl">{reaction.emoji}</span>
              <span className="sr-only">
                {reaction.label}
              </span>
            </button>
          ))}
        </div>
        
        {status === 'error' && message && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

