# Simple Blog Project (Next.js App Router)

Demo blog implementing the SRS: auth, roles, posts CRUD, comments, like/dislike, search, admin dashboard, responsive UI, and lazy-loading.

## Quick Start

```bash
npm install
npm run dev
# open http://localhost:3000
```

**Default Admin:**  
- Email: `admin@example.com`  
- Password: `admin123`

## Notes
- In-memory DB for demo (resets on server restart).  
- JWT cookie auth with role-based checks.  
- Lazy loading via dynamic import for PostCard.  
- Basic protections: httpOnly cookie, sameSite=lax; do NOT use in production without hardening.
