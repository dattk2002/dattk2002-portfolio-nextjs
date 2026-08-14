# Tran Kim Dat — Portfolio

A Next.js portfolio translating the approved pen.dev canvas into a responsive, editorial web experience.

Runtime: Node.js 24.x and Yarn 4.9.2.

## Stack

- Next.js App Router and TypeScript
- Yarn 4 with the `node-modules` linker
- Tailwind CSS and shadcn/ui conventions
- Framer Motion
- Lucide React
- Resend and Zod for the contact workflow

## Local development

```bash
corepack yarn install
Copy-Item .env.example .env.local
corepack yarn dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
corepack yarn typecheck
corepack yarn lint
corepack yarn build
```

## Environment

All public configuration and service credentials are documented in `.env.example`. Keep real credentials in `.env.local` locally and in Vercel Environment Variables for deployment.

The contact form uses Resend for delivery. Upstash Redis is optional; when its two REST variables are present, the server action also applies a fixed-window rate limit. The honeypot field remains active without Upstash.

## Content and routes

- `/` — portfolio home
- `/projects/tapmood`
- `/projects/habistride`
- `/projects/ngoaingungay`
- `/projects/trivia-quiz`
- `/documents/CV-Tran%20Kim%20Dat-Full-stack%20Developer.pdf` — downloadable CV

Portfolio content is maintained in `lib/projects.ts`, `lib/experience.ts`, `lib/site.ts`, and `lib/capabilities.ts`. Raster assets live under `public/images` and are stored as WebP.

## Deploy to Vercel

1. Import the GitHub repository into Vercel.
2. Keep the root directory at the repository root, the framework preset as Next.js, the package manager as Yarn, and Node.js at `24.x`.
3. Add the variables from `.env.example` for Production, Preview, and Development as appropriate.
4. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin and deploy.
5. Verify the contact form after the Resend sender domain has been approved.

No cookie banner is needed unless analytics, advertising, or other non-essential tracking is added later.
