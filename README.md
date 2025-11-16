# Welford IAG Support Portal (Next.js + Tailwind)

This is a clean, from-scratch **support portal** for Welford IAG with:

- Next.js 14 (App Router)
- Tailwind CSS with a light **blue & white** theme (`#1C3E66`)
- All writeups stored as **Markdown/MDX** files in `content/`
- Homepage with **search + result cards**
- Article page that renders the writeup when you click a card

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000

### Add a new writeup

1. Create a file in `content/`, for example:

   `content/reset-user-password.mdx`

2. Add frontmatter and content:

```md
---
title: "Resetting a User Password in Welford IAG"
description: "Steps for support engineers to safely reset a user password or trigger a reset email."
date: "2025-11-16"
tags:
  - password-reset
  - users
  - troubleshooting
category: "How-to"
keywords:
  - reset password
  - forgot password
  - account recovery
---

# Resetting a User Password

Write your detailed steps here...
```

3. The homepage will automatically show it as a card, and clicking it will open
   `/support/reset-user-password` with the full writeup.
