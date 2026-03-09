'use client';

import { useState } from 'react';

interface CopyImageUrlButtonProps {
  imageUrl: string;
}

export function CopyImageUrlButton({ imageUrl }: CopyImageUrlButtonProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const handleCopy = async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(imageUrl);
        setCopied(true);
        setError(false);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = imageUrl;
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
      console.error('Failed to copy image URL:', err);
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
          : 'text-green-600 border-green-600 hover:text-green-700 hover:bg-green-50'
      }`}
    >
      {copied ? '✓ Скопировано!' : error ? '✗ Ошибка' : 'Копировать URL изображения'}
    </button>
  );
}
