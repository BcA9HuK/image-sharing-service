import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Authentication Error</h1>
        <p className="text-gray-600">
          Something went wrong during authentication. Please try again.
        </p>
        <Link
          href="/login"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
