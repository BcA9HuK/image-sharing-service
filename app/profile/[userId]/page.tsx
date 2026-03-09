import { notFound } from 'next/navigation';
import { getUserById, getUserImages } from '@/app/actions/user';
import { ImageCard } from '@/components/ImageCard';
import { auth } from '@/auth';

interface UserProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { userId } = await params;
  const session = await auth();
  const isOwnProfile = session?.user?.id === userId;

  const user = await getUserById(userId);

  if (!user) {
    notFound();
  }

  // Get images (include private only if own profile)
  const images = await getUserImages(userId, isOwnProfile);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-6">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-24 h-24 rounded-full"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Участник с {new Date(user.createdAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isOwnProfile ? 'Мои изображения' : `Изображения ${user.username}`} ({images.length})
          </h2>

          {images.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600">
                {isOwnProfile
                  ? "Вы еще не загрузили ни одного изображения."
                  : 'У этого пользователя нет публичных изображений.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image) => (
                <div key={image._id} className="relative">
                  <ImageCard image={image} />
                  {!image.isPublic && isOwnProfile && (
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
