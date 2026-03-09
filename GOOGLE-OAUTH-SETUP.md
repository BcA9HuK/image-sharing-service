# Google OAuth Setup

## Что добавлено

- Google OAuth авторизация через NextAuth.js
- Автоматическое создание пользователя при первом входе через Google
- Страница выбора username для новых Google пользователей
- Кнопки "Войти через Google" на страницах логина и регистрации

## Локальная разработка

Credentials добавлены в `.env.local` (не коммитится в Git):
```
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
```

## Деплой на Vercel

Добавь эти переменные окружения в Vercel:

1. Зайди в настройки проекта на Vercel
2. Settings → Environment Variables
3. Добавь:
   - `GOOGLE_CLIENT_ID` = `<your-client-id>`
   - `GOOGLE_CLIENT_SECRET` = `<your-client-secret>`

4. Redeploy проект

## Как это работает

1. Пользователь нажимает "Войти через Google"
2. Google OAuth перенаправляет на страницу авторизации Google
3. После успешной авторизации:
   - Если пользователь уже существует в Sanity → вход выполнен
   - Если новый пользователь → редирект на `/auth/setup-username`
4. Пользователь выбирает username
5. Создается запись в Sanity с данными из Google (email, avatar)
6. Вход выполнен

## Google Cloud Console

Проект: `image-sharing-service`
Project ID: `image-sharing-service-409713`

OAuth Client ID настроен с:
- Authorized JavaScript origins:
  - `http://localhost:3000`
  - `https://image-sharing-service.vercel.app`
- Authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google`
  - `https://image-sharing-service.vercel.app/api/auth/callback/google`
