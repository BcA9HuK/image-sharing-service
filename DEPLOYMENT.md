# Деплой на Vercel

## Подготовка

### 1. Создайте GitHub репозиторий

Если еще не создали:

```bash
cd image-sharing-service
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ваш-username/ваш-репозиторий.git
git push -u origin main
```

### 2. Зарегистрируйтесь на Vercel

1. Перейдите на https://vercel.com
2. Нажмите "Sign Up"
3. Выберите "Continue with GitHub"
4. Авторизуйте Vercel для доступа к вашим репозиториям

## Деплой

### 1. Импортируйте проект

1. На главной странице Vercel нажмите "Add New..." → "Project"
2. Найдите ваш репозиторий в списке и нажмите "Import"
3. Vercel автоматически определит, что это Next.js проект

### 2. Настройте переменные окружения

В разделе "Environment Variables" добавьте следующие переменные:

**Обязательные:**
- `AUTH_SECRET` - ваш секретный ключ (скопируйте из .env.local)
- `NEXTAUTH_URL` - будет `https://ваш-проект.vercel.app`
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - ваш Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - `production`
- `SANITY_API_TOKEN` - ваш Sanity API token с правами на запись

**Опционально (если используете):**
- `NEXTAUTH_URL_INTERNAL` - оставьте пустым, Vercel сам настроит

### 3. Настройте Root Directory

⚠️ **ВАЖНО:** Ваш проект находится в папке `image-sharing-service`, поэтому:

1. В настройках проекта найдите "Root Directory"
2. Нажмите "Edit" и укажите: `image-sharing-service`
3. Нажмите "Continue"

### 4. Деплой

1. Нажмите "Deploy"
2. Дождитесь завершения сборки (2-5 минут)
3. После успешного деплоя вы получите URL вида `https://ваш-проект.vercel.app`

## После деплоя

### 1. Обновите NEXTAUTH_URL

1. Скопируйте URL вашего деплоя (например, `https://my-image-share.vercel.app`)
2. В настройках проекта Vercel → Settings → Environment Variables
3. Найдите `NEXTAUTH_URL` и обновите значение на ваш реальный URL
4. Нажмите "Save"
5. Перейдите в Deployments и нажмите "Redeploy" на последнем деплое

### 2. Настройте Sanity CORS

1. Перейдите в Sanity Studio: https://www.sanity.io/manage
2. Выберите ваш проект
3. Перейдите в API → CORS Origins
4. Нажмите "Add CORS origin"
5. Добавьте ваш Vercel URL: `https://ваш-проект.vercel.app`
6. Включите "Allow credentials"
7. Нажмите "Save"

### 3. Проверьте работу

1. Откройте ваш сайт по URL от Vercel
2. Попробуйте зарегистрироваться
3. Загрузите изображение
4. Проверьте все функции

## Автоматические деплои

Теперь при каждом push в GitHub:
- Vercel автоматически создаст новый деплой
- Вы получите preview URL для каждой ветки
- Production деплой происходит только из main ветки

## Troubleshooting

### Ошибка "AUTH_SECRET is not set"
- Убедитесь, что добавили переменную `AUTH_SECRET` в Vercel
- Сделайте Redeploy после добавления переменных

### Ошибка подключения к Sanity
- Проверьте, что добавили Vercel URL в CORS Origins в Sanity
- Проверьте правильность `SANITY_API_TOKEN`

### Ошибка 404 на страницах
- Убедитесь, что указали правильный Root Directory: `image-sharing-service`

### Ошибки сборки
- Проверьте логи сборки в Vercel
- Убедитесь, что все зависимости установлены в package.json
