# Быстрый старт деплоя на Vercel

## 1. Создайте GitHub репозиторий

```bash
cd image-sharing-service
git init
git add .
git commit -m "Initial commit"
```

Затем создайте репозиторий на GitHub и:

```bash
git remote add origin https://github.com/ваш-username/название-репо.git
git push -u origin main
```

## 2. Деплой на Vercel

1. Перейдите на https://vercel.com
2. Войдите через GitHub
3. Нажмите "Add New..." → "Project"
4. Выберите ваш репозиторий
5. **ВАЖНО:** В "Root Directory" укажите `image-sharing-service`
6. Добавьте переменные окружения:

```
AUTH_SECRET=4WwxqpgAR1nE1WjdnYhnz5YERkQblxC/tZeLP6mFrnU=
NEXTAUTH_URL=https://ваш-проект.vercel.app
NEXT_PUBLIC_SANITY_PROJECT_ID=n98uzxnu
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk2SFb8gzZIaTjQ7md5NuzDVM4l5LkC77zJLDZJgfVjisNqh103IrLB42plsowX5giQDTeGSJNBTbBXpXcHWvR6zmZ26DIXvQQpXtLg8xwosMIHf0gFnDNnqZTiTJAwEXfyhIFJKBuYOPeMT9TVYT5kKYHwkIg4JJVWq3fFqYg0Vf3ti6Azu
```

7. Нажмите "Deploy"

## 3. После первого деплоя

1. Скопируйте URL вашего проекта (например, `https://my-app.vercel.app`)
2. В Vercel → Settings → Environment Variables
3. Обновите `NEXTAUTH_URL` на ваш реальный URL
4. Redeploy проект

## 4. Настройте Sanity CORS

1. https://www.sanity.io/manage
2. Выберите проект `n98uzxnu`
3. API → CORS Origins → Add CORS origin
4. Добавьте: `https://ваш-проект.vercel.app`
5. Включите "Allow credentials"
6. Save

Готово! Ваш сайт работает 🎉
