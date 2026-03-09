import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserById, getUserImages } from '../actions/user';
import { ImageCard } from '@/components/ImageCard';
import Link from 'next/link';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const user = await getUserById(session.user.id);
  const images = await getUserImages(session.user.id, true); // Include private images

  if (!user) {
    redirect('/login');
  }

  // Calculate statistics
  const totalViews = images.reduce((sum, img) => sum + img.views, 0);
  const publicImages = images.filter(img => img.isPublic).length;
  const privateImages = images.filter(img => !img.isPublic).length;

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-6">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-24 h-24 rounded-full"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{user.username}</h1>
              <p className="text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Участник с {new Date(user.createdAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
            <Link
              href="/upload"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Загрузить изображение
            </Link>
          </div>

          {/* Statistics */}
          <div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{images.length}</div>
              <div className="text-sm text-gray-400">Всего изображений</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{publicImages}</div>
              <div className="text-sm text-gray-400">Публичных</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">{privateImages}</div>
              <div className="text-sm text-gray-400">Приватных</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{totalViews}</div>
              <div className="text-sm text-gray-400">Всего просмотров</div>
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Мои изображения ({images.length})
            </h2>
          </div>

          {images.length === 0 ? (
            <div className="bg-gray-800 rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-400 mb-4">Вы еще не загрузили ни одного изображения.</p>
              <Link
                href="/upload"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Загрузить первое изображение
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image) => (
                <div key={image._id} className="relative">
                  <ImageCard image={image} />
                  {!image.isPublic && (
                    <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      Приватное
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
