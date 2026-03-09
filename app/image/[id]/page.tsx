import { notFound } from 'next/navigation';
import { getImageById, incrementViewCount } from '@/app/actions/image';
import { urlFor } from '@/lib/sanity/client';
import { auth } from '@/auth';
import Link from 'next/link';
import { DeleteImageButton } from '@/components/DeleteImageButton';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { CopyImageUrlButton } from '@/components/CopyImageUrlButton';

interface ImagePageProps {
  params: Promise<{ id: string }>;
}

export default async function ImagePage({ params }: ImagePageProps) {
  const { id } = await params;
  
  try {
    const image = await getImageById(id);

    if (!image) {
      notFound();
    }

    // Increment view count
    await incrementViewCount(id);

    const session = await auth();
    // Handle both reference format (_ref) and populated format (_id)
    const authorId = image.author._ref || image.author._id;
    const isAuthor = session?.user?.id === authorId;

    // Check if it's a GIF to avoid transformation issues
    const assetRef = image.image.asset._ref;
    const isGif = assetRef.includes('-gif');
    
    // For GIFs, use original URL without transformations to preserve animation
    const imageUrl = isGif 
      ? urlFor(image.image).url() 
      : urlFor(image.image).width(1200).url();

    return (
      <div className="min-h-screen bg-gray-950 py-4 sm:py-8">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={imageUrl}
                alt={image.title}
                className="w-full h-auto max-h-[400px] sm:max-h-[600px] object-contain bg-gray-700"
              />
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{image.title}</h1>
                  {image.description && (
                    <p className="mt-2 text-sm sm:text-base text-gray-400">{image.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2 self-end sm:self-start">
                  <CopyLinkButton imageId={image._id} />
                  <CopyImageUrlButton imageUrl={imageUrl} />
                  {isAuthor && (
                    <DeleteImageButton imageId={image._id} />
                  )}
                </div>
              </div>

              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-gray-700 pt-4 gap-3 sm:gap-0">
                <div className="flex items-center space-x-4">
                  <Link
                    href={`/profile/${authorId}`}
                    className="flex items-center space-x-2 hover:underline"
                  >
                    {image.author?.avatar && (
                      <img
                        src={image.author.avatar}
                        alt={image.author.username}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                      />
                    )}
                    <span className="font-medium text-sm sm:text-base text-white">
                      {image.author?.username || 'Unknown'}
                    </span>
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-400">
                  <span>{image.views} просмотров</span>
                  <span>
                    {image.isPublic ? (
                      <span className="text-green-500">Публичное</span>
                    ) : (
                      <span className="text-gray-400">Приватное</span>
                    )}
                  </span>
                  <span>
                    {new Date(image.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    if (error.statusCode === 403) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Доступ запрещен</h1>
            <p className="mt-2 text-gray-400">Это изображение приватное.</p>
            <Link href="/" className="mt-4 inline-block text-blue-400 hover:underline">
              Вернуться на главную
            </Link>
          </div>
        </div>
      );
    }
    throw error;
  }
}
