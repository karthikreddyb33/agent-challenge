# Nosana - Docker Setup

This document provides instructions for building and running the Nosana application using Docker.

## Prerequisites

- Docker 20.10.0 or higher
- Docker Compose 2.0.0 or higher
- Node.js 18+ (for local development without Docker)
- Python 3.11+ (for local development without Docker)

## Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd nosana
   ```

2. **Copy the example environment file**:
   ```bash
   cp .env.example .env
   ```

3. **Update the `.env` file** with your actual configuration:
   - Set up your preferred AI model (Ollama or OpenAI)
   - Add any API keys (Solscan, etc.)
   - Configure the Solana RPC endpoint if needed

## Building and Running with Docker

### Development Mode

For development with hot-reloading:

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f
```

### Production Mode

For production deployment:

```bash
# Build the production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Start the services in detached mode
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Stopping the Services

```bash
# Stop all services
docker-compose down

# Stop and remove all containers, networks, and volumes
docker-compose down -v
```

## Troubleshooting

### Common Issues

1. **Port conflicts**:
   - Ensure ports 3000 and 8000 are not in use by other applications
   - Update the port mappings in `docker-compose.yml` if needed

2. **Build failures**:
   - Check for network connectivity
   - Ensure you have enough disk space
   - Run `docker system prune` to clean up unused resources

3. **Environment variables**:
   - Make sure all required environment variables are set in `.env`
   - The application won't start without required variables

### Viewing Logs

```bash
# View logs for all services
docker-compose logs -f

# View logs for a specific service
docker-compose logs -f frontend
docker-compose logs -f backend
```

## Development Workflow

### Running Tests

```bash
# Run backend tests
docker-compose run --rm backend pytest

# Run frontend tests
docker-compose run --rm frontend npm test
```

### Database Migrations

If your application uses a database, you can run migrations with:

```bash
docker-compose run --rm backend alembic upgrade head
```

## Production Deployment

For production deployments, consider:

1. Using a reverse proxy (Nginx, Traefik, etc.)
2. Setting up HTTPS with Let's Encrypt
3. Configuring proper logging and monitoring
4. Setting up backups for persistent data

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
