# Image Sharing Service - Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Sanity.io account (free tier works)

## 1. Sanity Setup

### Create a Sanity Project

1. Go to [sanity.io](https://www.sanity.io/) and sign up/login
2. Create a new project:
   - Click "Create new project"
   - Choose a project name (e.g., "image-sharing-service")
   - Choose a dataset name (use "production")
   - Note down your **Project ID**

### Get API Token

1. In your Sanity project dashboard, go to **API** section
2. Click **Tokens** tab
3. Click **Add API token**
4. Give it a name (e.g., "Next.js App")
5. Set permissions to **Editor** (for write access)
6. Copy the token (you won't see it again!)

### Deploy Sanity Schema

You need to deploy the schemas to your Sanity project. There are two options:

#### Option A: Using Sanity Studio (Recommended)

1. Install Sanity CLI globally:
   ```bash
   npm install -g @sanity/cli
   ```

2. Initialize Sanity Studio in a separate folder:
   ```bash
   cd ..
   sanity init
   ```
   - Select your existing project
   - Use default dataset (production)
   - Choose "Clean project with no predefined schemas"

3. Copy the schema files from `image-sharing-service/lib/sanity/schemas/` to the Sanity Studio `schemas/` folder

4. Update the `sanity.config.ts` to import your schemas:
   ```typescript
   import { userSchema } from './schemas/user'
   import { imagePostSchema } from './schemas/imagePost'
   
   export default defineConfig({
     // ... other config
     schema: {
       types: [userSchema, imagePostSchema],
     },
   })
   ```

5. Deploy the schema:
   ```bash
   sanity deploy
   ```

#### Option B: Manual Schema Creation

1. Go to your Sanity project dashboard
2. Navigate to **Schema** section
3. Manually create the schemas based on the files in `lib/sanity/schemas/`

## 2. Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the values in `.env.local`:

   ```env
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   
   # Sanity Configuration
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your-api-token-here
   ```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use this Node.js command:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 3. Install Dependencies

Dependencies should already be installed, but if needed:

```bash
npm install
```

## 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 5. Test the Application

1. **Sign Up**: Go to `/signup` and create an account
2. **Login**: Use your credentials to log in
3. **Upload**: Go to `/upload` and upload an image
4. **Browse**: View public images on the home page
5. **Profile**: Check your profile at `/profile`

## Troubleshooting

### "Missing NEXT_PUBLIC_SANITY_PROJECT_ID"

Make sure your `.env.local` file exists and contains the correct Sanity project ID.

### "Sanity API errors"

- Check that your API token has **Editor** permissions
- Verify the token is correctly set in `.env.local`
- Make sure the schemas are deployed to Sanity

### "Authentication not working"

- Verify `NEXTAUTH_SECRET` is set in `.env.local`
- Make sure `NEXTAUTH_URL` matches your development URL

### Images not uploading

- Check Sanity API token permissions
- Verify the image schema is deployed
- Check browser console for errors

## Project Structure

```
image-sharing-service/
├── app/
│   ├── actions/          # Server Actions
│   ├── api/              # API Routes
│   ├── image/[id]/       # Image detail page
│   ├── login/            # Login page
│   ├── profile/          # Profile pages
│   ├── signup/           # Signup page
│   ├── upload/           # Upload page
│   └── page.tsx          # Home page
├── components/           # React components
├── lib/
│   ├── sanity/          # Sanity client and schemas
│   ├── authorization.ts  # Auth utilities
│   ├── errors.ts        # Error handling
│   └── validation.ts    # Input validation
├── auth.config.ts       # NextAuth configuration
├── auth.ts              # NextAuth setup
└── middleware.ts        # Route protection
```

## Next Steps

- Customize the UI styling
- Add more features (comments, likes, etc.)
- Deploy to production (Vercel recommended)
- Set up proper error monitoring
- Add tests

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Make sure to update `NEXTAUTH_URL` to your production URL.
