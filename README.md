# 📚 Book Lending Tracker

A full-stack **Book Lending Tracker** application that allows users to manage their personal library, lend books, track borrowing history, and view dashboard statistics — fully containerized with **Docker**, **NestJS**, **React/Next.js**, **Nginx**, and **PostgreSQL**.

---

## 🚀 Features

- **User Authentication** (JWT-based login & registration)
- **Book Management**: Add, edit, delete, and mark books as available/borrowed
- **Lending System**: Record borrowers, lend dates, expected return dates
- **Return Tracking**: Mark books as returned
- **Dashboard**:
    - Total books owned
    - Borrowed books
    - Overdue books
- **Multi-device Ready**: API can be consumed by web, mobile, or third-party apps

---

## 🛠 Tech Stack

**Frontend**
- React (Next.js) + TypeScript
- API calls via fetch/Axios
- Environment-based API URL

**Backend**
- NestJS (Node.js + TypeScript)
- PostgreSQL with Prisma/TypeORM
- Repository Pattern for DB access
- SOLID principles
- Structured logging (Winston/Pino)

**Infrastructure**
- PostgreSQL database
- Nginx reverse proxy (API routing & static content)
- Docker & Docker Compose

--- In Summary ------------------------
| Layer        | Tech Stack                  | Notes |
|--------------|-----------------------------|-------|
| Frontend     | React (Next.js) + TypeScript | Modern UI, SSR/SSG ready |
| Backend      | NestJS + TypeScript          | SOLID principles, Repository Pattern |
| Database     | PostgreSQL                   | Strong relational consistency |
| Infrastructure | Nginx + Docker Compose     | Reverse proxy & container orchestration |
| ORM          | Prisma / TypeORM             | Type-safe DB access |
| Auth         | JWT + bcrypt                 | Stateless authentication |
| Logging      | Winston / Pino               | Structured logs for observability |

---

## 📂 Project Structure

/project-root
/backend → NestJS API service
/frontend → Next.js frontend service
/nginx → Nginx reverse proxy config
docker-compose.yml
.env

## ⚙️ Setup Instructions

Follow these steps in order:

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourname/book-lending-tracker.git
   cd book-lending-tracker
   
2. **Create environment files**
    - Copy `.env.example` to `.env` in both `backend` and `frontend` directories
    - Update the environment variables as needed (e.g., database connection, API URLs)
3. **Build and run the stack**
   - docker compose up -d --build
4. **Verify services are running**
    - Frontend: http://localhost
    - API: http://localhost/api
    - Database: localhost:5432 (PostgreSQL)
5. **Run database migrations (if using Prisma or TypeORM)**
   - docker compose exec backend npm run migrate
6. **Seed initial data (optional, for demo/testing)**
   - docker compose exec backend npm run seed
7. **Run tests**
   - docker compose exec backend npm run test
   - docker compose exec frontend npm run test
8. **Stop the stack**
   - docker compose down


📡 API Routing via Nginx
/api → Proxies to backend:4000
/ → Proxies to frontend:3000 (Next.js app)




📜 License

MIT © 2025 T.M Harshanika Thennakoon