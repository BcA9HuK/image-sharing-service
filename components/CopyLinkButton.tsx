'use client';

import { useState } from 'react';

interface CopyLinkButtonProps {
  imageId: string;
}

export function CopyLinkButton({ imageId }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/image/${imageId}`;
    
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setError(false);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            setCopied(true);
            setError(false);
            setTimeout(() => setCopied(false), 2000);
          } else {
            throw new Error('Copy command failed');
          }
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error('Failed to copy link:', err);
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${
        error
          ? 'text-red-600 border-red-600 hover:bg-red-50'
          : 'text-blue-600 border-blue-600 hover:text-blue-700 hover:bg-blue-50'
      }`}
    >
      {copied ? '✓ Скопировано!' : error ? '✗ Ошибка' : 'Копировать ссылку'}
    </button>
  );
}
