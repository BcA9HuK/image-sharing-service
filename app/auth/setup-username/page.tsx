'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { validateUsername } from '@/lib/validation';

export default function SetupUsernamePage() {
  const router = useRouter();
  const { data: session, update } = useSession();

  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if user doesn't need username setup
    if (session && !session.user.needsUsername) {
      router.push('/');
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    // Client-side validation
    if (!validateUsername(username)) {
      setErrors(['Имя пользователя должно содержать 3-30 буквенно-цифровых символов']);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/setup-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.details?.errors) {
          setErrors(data.error.details.errors);
        } else {
          setErrors([data.error?.message || 'Ошибка создания пользователя']);
        }
      } else {
        // Update session with new user data
        if (session) {
          await update({
            user: {
              ...session.user,
              id: data.user._id,
              username: data.user.username,
              needsUsername: false,
            },
          });
        }
        
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setErrors(['Произошла ошибка. Попробуйте снова.']);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-white">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-3 sm:px-4">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-white">
            Выберите имя пользователя
          </h2>
          <p className="mt-2 text-center text-xs sm:text-sm text-gray-400">
            Последний шаг для завершения регистрации
          </p>
        </div>

        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          {errors.length > 0 && (
            <div className="bg-red-900 bg-opacity-50 border border-red-700 text-red-200 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm">
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Имя пользователя
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base text-gray-100 bg-gray-700"
              placeholder="3-30 символов"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 sm:py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Создание...' : 'Продолжить'}
          </button>
        </form>
      </div>
    </div>
  );
}
