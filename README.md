# Image Sharing Service

Мини-аналог Imgur - сервис для загрузки и обмена изображениями с авторизацией и приватностью.

## Возможности

- 🔐 Регистрация и авторизация пользователей
- 📸 Загрузка изображений (JPEG, PNG, GIF, WebP) до 10МБ
- 🔒 Публичные и приватные изображения
- 👁️ Счетчик просмотров
- 👤 Профили пользователей с статистикой
- 🖼️ Галерея публичных изображений
- 🗑️ Удаление своих изображений
- 🔗 Копирование ссылок на изображения
- 📊 Сортировка (по дате, популярности, названию)
- 📄 Пагинация (загрузка по 20 изображений)
- 🌙 Темная тема

## Технологии

- **Frontend/Backend**: Next.js 15.1.6 (App Router)
- **Аутентификация**: NextAuth.js v5
- **База данных**: Sanity.io
- **Язык**: TypeScript
- **Стили**: Tailwind CSS v4
- **Тестирование**: Vitest + fast-check (Property-Based Testing)

## Быстрый старт

### Локальная разработка

1. Клонируйте репозиторий
2. Установите зависимости: `npm install`
3. Настройте Sanity проект (см. [SETUP.md](./SETUP.md))
4. Скопируйте `.env.example` в `.env.local` и заполните переменные
5. Запустите: `npm run dev`
6. Откройте http://localhost:3000

Подробная инструкция по настройке в [SETUP.md](./SETUP.md)

### Деплой на Vercel

Быстрая инструкция: [VERCEL-QUICK-START.md](./VERCEL-QUICK-START.md)

Полная инструкция: [DEPLOYMENT.md](./DEPLOYMENT.md)

## Структура проекта

```
├── app/              # Next.js App Router
│   ├── actions/      # Server Actions
│   ├── api/          # API Routes
│   ├── auth/         # Страницы аутентификации
│   ├── image/        # Страница просмотра изображения
│   ├── login/        # Страница входа
│   ├── profile/      # Страница профиля
│   ├── signup/       # Страница регистрации
│   └── upload/       # Страница загрузки
├── components/       # React компоненты
│   ├── ImageCard.tsx
│   ├── ImageGallery.tsx
│   ├── Navigation.tsx
│   └── ...
├── lib/             # Утилиты и конфигурация
│   ├── sanity/      # Sanity клиент и схемы
│   ├── validation.ts
│   ├── authorization.ts
│   └── errors.ts
├── auth.config.ts   # NextAuth конфигурация
├── auth.ts          # NextAuth setup
└── middleware.ts    # Защита роутов
```

## Скрипты

- `npm run dev` - запуск dev сервера
- `npm run build` - сборка для продакшена
- `npm start` - запуск продакшен сервера
- `npm test` - запуск тестов
- `npm run lint` - проверка кода

## Переменные окружения

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
```

## Лицензия

MIT

