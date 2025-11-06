# 🚀 Express API Starter Pro

A **production-ready Express 5 boilerplate** with secure authentication, refresh tokens, Swagger docs, Docker support, and clean modular architecture.  
Ideal for developers who want to **launch APIs fast** with best practices pre-configured.

---

## 🌟 Features

| Category | Details |
|-----------|----------|
| ⚙️ Framework | Express 5 (latest stable) |
| 🧱 Database | MongoDB (via Mongoose 8) |
| 🔐 Security | JWT Auth, Refresh Tokens, Helmet, CORS, Rate Limiting |
| 🧩 Validation | Zod (modern schema validation) |
| 📜 Documentation | Swagger UI (`/api/docs`) |
| 🪵 Logging | Winston + Morgan combo |
| 🧰 Utilities | Docker, .env example, RBAC, Postman collection |
| 🤖 Optional | AI route template with OpenAI API |

---

## ⚙️ Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/Fcontice/express-api-starter-pro.git
cd express-api-starter-pro

# 2. Setup environment
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev