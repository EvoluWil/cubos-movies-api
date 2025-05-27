# Cubos Movies API

A robust, production-ready RESTful API for managing movies, genres, and languages, built with [NestJS](https://nestjs.com/), Prisma ORM, and PostgreSQL. Includes authentication, file upload, email notifications, and scheduled webhooks. Comprehensive unit and e2e tests ensure reliability and maintainability.

---

## Features

- **Authentication**: JWT-based sign-up, sign-in, password recovery, and account deletion.
- **Movies**: CRUD operations with genre/language relations, image upload (S3), and permission checks.
- **Genres & Languages**: Manage and list genres/languages (admin only for create).
- **File Upload**: Upload movie images via base64 (S3 integration, mocked in tests).
- **Email**: Password recovery, notifications (nodemailer, mocked in tests).
- **Webhooks**: Scheduled daily tasks (e.g., email digests).
- **Comprehensive Testing**: Unit and e2e tests for all modules, with proper mocking and test DB isolation.

---

## Getting Started

### Prerequisites
- Node.js v18+
- Yarn
- PostgreSQL (local or Docker)

### Environment Variables
Copy `.env.example` to `.env` and configure:

```
DATABASE_URL=postgresql://user:password@localhost:5432/cubos_movies
CRYPTO_SECRET=your-crypto-secret
JWT_SECRET=your-jwt-secret
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket
MAIL_USER=your@email.com
MAIL_PASS=your-mail-pass
```

### Installation
```bash
yarn install
```

### Database Setup
```bash
yarn prisma migrate deploy   # or: yarn prisma migrate dev
yarn prisma db seed          # seeds languages, genres, admin user, etc.
```

---

## Running the Application

```bash
# Development
yarn start:dev

# Production
yarn build && yarn start:prod
```

---

## API Overview

### Auth
- `POST /auth/sign-up` — Register
- `POST /auth/sign-in` — Login
- `POST /auth/forgot-password` — Request password reset
- `POST /auth/validate-code` — Validate reset code
- `POST /auth/recovery-password` — Set new password
- `DELETE /auth/delete-account` — Delete user

### Movies
- `GET /movies` — List movies (auth required)
- `POST /movies` — Create movie (auth required)
- `GET /movies/:id` — Get movie by ID
- `PATCH /movies/:id` — Update movie (owner only)
- `DELETE /movies/:id` — Delete movie (owner only)

### Genres & Languages
- `GET /genres` — List genres (auth required)
- `POST /genres` — Create genre (admin only)
- `GET /languages` — List languages (auth required)

### Upload
- `POST /upload` — Upload image (base64, auth required)

### Webhooks
- `POST /webhook/daily-task` — Trigger daily task (admin only)

---

## Testing

### Unit Tests
```bash
yarn test
```

### E2E Tests
```bash
yarn test:e2e
```
- Uses a dedicated test database (see `.env.test`).
- Seeds required data before running.
- All private endpoints require JWT (see test/app.e2e-spec.ts for flow).

### Coverage
```bash
yarn test:cov
```

---

## Development & Contribution
- Follow best practices for NestJS and Prisma.
- All new features must include unit and e2e tests.
- Use mocks for external services (mail, S3, etc.) in tests.

---

## License

MIT