# Digital Library - LibStack

A modern Digital Library application built with Spring Boot, React Vite, PostgreSQL, and Docker. Features OAuth2 authentication with GitHub and Google providers.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Compose                           │
├─────────────┬─────────────┬─────────────────────────────────┤
│   Frontend  │   Backend   │           PostgreSQL            │
│  (React +   │  (Spring    │         (Database)              │
│   Vite +    │   Boot +    │                                   │
│   Nginx)    │   OAuth2)   │                                   │
└─────────────┴─────────────┴─────────────────────────────────┘
```

## 🚀 Features

- **Authentication**: OAuth2 with GitHub and Google
- **Book Management**: Browse, search, add, edit, delete books
- **Category Management**: Organize books by categories
- **Loan System**: Borrow and return books with due date tracking
- **User Roles**: Admin and regular user roles
- **Admin Dashboard**: User management and loan monitoring
- **Responsive Design**: Works on desktop, tablet, and mobile

## 📋 Prerequisites

- Docker and Docker Compose
- GitHub OAuth App (for GitHub login)
- Google OAuth Client (for Google login)

## 🛠️ Setup Instructions

### 1. Clone and Navigate

```bash
git clone https://github.com/imrajeevnayan/digital-library-app.git
cd digital-library-app
```

### 2. Configure OAuth2 Credentials

Create `.env` file in the root directory:

```env
# GitHub OAuth2
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Google OAuth2
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### GitHub OAuth2 Setup:
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set Homepage URL: `http://localhost`
4. Set Authorization callback URL: `http://localhost:8080/login/oauth2/code/github`

#### Google OAuth2 Setup:
1. Go to Google Cloud Console
2. Create a new project or select existing
3. Enable OAuth2 in APIs & Services → Credentials
4. Create OAuth Client ID
5. Set Authorized redirect URIs: `http://localhost:8080/login/oauth2/code/google`
6. Copy Client ID and Client Secret

### 3. Start the Application

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Spring Boot backend on port 8080
- React frontend on port 5173 (development) or port 80 (production)

### 4. Access the Application

- **Development**: http://localhost:5173
- **Production**: http://localhost
- **API Docs**: http://localhost:8080/api-docs
- **Swagger UI**: http://localhost:8080/swagger-ui.html

## 🔄 CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment.

### Workflows

#### 1. Main CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

This pipeline runs on push to `main` and pull requests:

| Job | Description | Trigger |
|-----|-------------|---------|
| `test-backend` | Runs Maven tests for Spring Boot backend | PR to main |
| `test-frontend` | Runs linting and tests for React frontend | PR to main |
| `build-docker` | Builds and pushes Docker images to GHCR | Push to main |
| `deploy-staging` | Deploys to staging environment | Push to main |
| `deploy-production` | Deploys to production environment | After staging |
| `cleanup` | Cleans up Docker resources | Always |
| `notify-failure` | Sends Slack notification on failure | On failure |

#### 2. Development Pipeline (`.github/workflows/development.yml`)

This pipeline runs on push to `develop`:

| Job | Description | Trigger |
|-----|-------------|---------|
| `code-quality` | Runs linters and code quality checks | PR to develop |
| `security-scan` | Trivy and Snyk security scans | PR to develop |
| `test-backend` | Runs backend tests | PR to develop |
| `test-frontend` | Runs frontend tests | PR to develop |
| `build-push-dev` | Builds and pushes `-develop` tagged images | Push to develop |
| `deploy-dev` | Deploys to development environment | Push to develop |

### Pipeline Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Git Push / PR                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Test & Build Stage                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  Backend     │  │  Frontend    │  │  Security Scan   │   │
│  │  Tests       │  │  Tests +     │  │  (Trivy + Snyk)  │   │
│  │  (Maven)     │  │  Build       │  │                  │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Staging     │  │  Production  │  │  Notifications│
│  Deployment  │  │  Deployment  │  │  (Slack)     │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Required Secrets

Configure these secrets in your GitHub repository settings:

| Secret | Description | Required For |
|--------|-------------|--------------|
| `GITHUB_CLIENT_ID` | GitHub OAuth2 Client ID | Backend, Deployment |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth2 Client Secret | Backend, Deployment |
| `GOOGLE_CLIENT_ID` | Google OAuth2 Client ID | Backend, Deployment |
| `GOOGLE_CLIENT_SECRET` | Google OAuth2 Client Secret | Backend, Deployment |
| `SLACK_WEBHOOK_URL` | Slack webhook URL for notifications | All deployments |

### Setting Up GitHub Packages Access

1. Enable read/write permissions for workflows:
   - Repository Settings → Actions → General
   - Under "Workflow permissions", enable "Read and write permissions"

2. For GitHub Container Registry:
   - Enable "Improved container support" in repository settings
   - Or use Docker Hub as an alternative

### Environment Configuration

Create environments in GitHub:

1. **Development** (optional)
   - URL: https://dev.library.example.com
   - Protection rules: None

2. **Staging**
   - URL: https://staging.library.example.com
   - Protection rules: Require approval from reviewers

3. **Production**
   - URL: https://library.example.com
   - Protection rules: Require approval from reviewers

## 🏗️ Project Structure

```
libstack/
├── .github/
│   └── workflows/
│       ├── ci-cd.yml           # Main CI/CD pipeline
│       └── development.yml     # Development pipeline
├── scripts/
│   ├── backup.sh               # Database backup script
│   └── restore.sh              # Database restore script
├── docker-compose.yml          # Docker orchestration
├── docker-compose.backup.yml   # Backup composition
├── .env                        # Environment variables
├── .gitignore
├── README.md
├── SECURITY.md
├── backend/                    # Spring Boot Application
│   ├── src/main/java/com/libstack/
│   │   ├── config/            # Security, CORS, OAuth2
│   │   ├── controller/        # REST API Controllers
│   │   ├── model/             # JPA Entities
│   │   ├── repository/        # JPA Repositories
│   │   ├── service/           # Business Logic
│   │   └── dto/               # Data Transfer Objects
│   ├── Dockerfile
│   └── pom.xml
└── frontend/                   # React Vite Application
    ├── src/
    │   ├── api/               # Axios API client
    │   ├── components/        # Reusable components
    │   ├── contexts/          # React contexts
    │   ├── pages/             # Page components
    │   └── hooks/             # Custom hooks
    ├── Dockerfile
    ├── nginx.conf
    └── vite.config.js
```

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/auth/user` | Get current user |

### Books
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/books` | List books (paginated) | Public |
| GET | `/api/v1/books/{id}` | Get book by ID | Public |
| POST | `/api/v1/books` | Create book | Admin |
| PUT | `/api/v1/books/{id}` | Update book | Admin |
| DELETE | `/api/v1/books/{id}` | Delete book | Admin |

### Categories
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/categories` | List categories | Public |
| POST | `/api/v1/categories` | Create category | Admin |
| PUT | `/api/v1/categories/{id}` | Update category | Admin |
| DELETE | `/api/v1/categories/{id}` | Delete category | Admin |

### Loans
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/loans/my-loans` | Get active loans | User |
| GET | `/api/v1/loans/my-history` | Get loan history | User |
| POST | `/api/v1/loans/borrow/{bookId}` | Borrow a book | User |
| POST | `/api/v1/loans/return/{loanId}` | Return a book | User |

### Admin
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/admin/users` | List all users | Admin |
| PUT | `/api/v1/admin/users/{id}/role` | Update user role | Admin |
| GET | `/api/v1/admin/loans` | List all loans | Admin |
| GET | `/api/v1/admin/loans/overdue` | Get overdue loans | Admin |

## 🧪 Development

### Backend Development

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Database Management

Access PostgreSQL:
```bash
docker exec -it libstack-db psql -U postgres -d library
```

### Backup and Restore

Create a backup:
```bash
./scripts/backup.sh ./backups
```

Restore from backup:
```bash
./scripts/restore.sh ./backups/libstack_backup_20240115_120000.sql.gz
```

## 🔧 Configuration

### Backend Configuration (`backend/src/main/resources/application.yml`)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/library
    username: postgres
    password: 123
  security:
    oauth2:
      client:
        registration:
          github:
            client-id: ${GITHUB_CLIENT_ID}
            client-secret: ${GITHUB_CLIENT_SECRET}
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
```

### Frontend Configuration (`frontend/vite.config.js`)

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
      '/oauth2': 'http://localhost:8080',
      '/login': 'http://localhost:8080'
    }
  }
})
```

## 🚢 Deployment

### Production Build

```bash
docker-compose -f docker-compose.yml up -d --build
```

### Stop Application

```bash
docker-compose down
```

### Reset Database

```bash
docker-compose down -v
docker-compose up -d
```

### GitHub Actions Deployment

Deploy to staging (push to `main`):
```bash
git checkout main
git merge develop
git push origin main
```

Deploy to production (requires approval):
1. Push to `main` triggers staging deployment
2. Review staging deployment
3. Approve production deployment in GitHub
4. Production deployment automatically triggers

## 📊 Monitoring

### Health Checks

- Frontend: `curl http://localhost:80`
- Backend: `curl http://localhost:8080/actuator/health`
- API: `curl http://localhost:8080/api/v1/auth/user`

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## 📦 Technology Stack

### Backend
- Java 25
- Spring Boot 3.4
- Spring Security with OAuth2 Client
- PostgreSQL
- JPA/Hibernate
- Lombok
- SpringDoc OpenAPI (Swagger)

### Frontend
- React 19
- Vite 6
- React Router 7
- Axios
- TanStack Query (React Query)
- CSS3 with custom properties

### DevOps
- Docker
- Docker Compose
- Nginx (production)
- GitHub Actions (CI/CD)
- Trivy (Security scanning)
- Snyk (Dependency scanning)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

### Reporting Issues

Use GitHub Issues to report bugs or request features:
- Bug reports: Use the Bug Report template
- Feature requests: Use the Feature Request template

### Pull Requests

1. Fork the repository
2. Create a feature branch from `develop`
3. Make your changes
4. Ensure all tests pass
5. Open a pull request to `develop`

### Code Style

- Backend: Follow Spring Boot conventions
- Frontend: Follow React best practices
- All code: Run linters before committing

## 🔒 Security

See [SECURITY.md](SECURITY.md) for our security policy and reporting guidelines.
