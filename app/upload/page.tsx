'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateImageFile, validateImageTitle } from '@/lib/validation';

export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (selectedFile: File) => {
    // Validate file
    const validation = validateImageFile(selectedFile);
    if (!validation.valid) {
      setErrors(validation.errors);
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);
    setErrors([]);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Validate
    const validationErrors: string[] = [];

    if (!file) {
      validationErrors.push('Пожалуйста, выберите изображение');
    }

    if (!validateImageTitle(title)) {
      validationErrors.push('Название обязательно');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file!);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('isPublic', String(isPublic));

      console.log('Uploading image...', { title, isPublic, fileSize: file!.size });
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Ошибка загрузки');
      }

      console.log('Upload successful:', data.image);
      router.push(`/image/${data.image._id}`);
      router.refresh();
    } catch (error: any) {
      console.error('Upload error:', error);
      setErrors([error.message || 'Не удалось загрузить изображение']);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-4 sm:py-8">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Загрузить изображение</h1>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Файл изображения
              </label>
              
              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-900 bg-opacity-20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="space-y-2">
                  <svg
                    className="mx-auto h-8 sm:h-12 w-8 sm:w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="text-sm sm:text-base text-gray-300">
                    <span className="font-medium text-blue-400 hover:text-blue-300">
                      Нажмите для выбора
                    </span>
                    {' '}или перетащите файл сюда
                  </div>
                  <p className="text-xs text-gray-500">
                    JPEG, PNG, GIF, WebP (макс. 10МБ)
                  </p>
                </div>
              </div>
            </div>

            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Предпросмотр"
                  className="max-w-full h-auto rounded-lg shadow-md max-h-64 sm:max-h-96 mx-auto"
                />
                <p className="text-center text-xs sm:text-sm text-gray-400 mt-2 break-all px-2">
                  {file?.name}
                </p>
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                Название *
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base text-gray-100 bg-gray-700"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                Описание
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base text-gray-100 bg-gray-700"
              />
            </div>

            <div className="flex items-center">
              <input
                id="isPublic"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-300">
                Сделать изображение публичным
              </label>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                type="submit"
                disabled={loading || !file}
                className="flex-1 bg-blue-600 text-white px-4 py-2.5 sm:py-2 rounded-md text-sm sm:text-base font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Загрузка...' : 'Загрузить изображение'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2.5 sm:py-2 border border-gray-600 rounded-md text-sm sm:text-base text-gray-300 hover:bg-gray-700"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
