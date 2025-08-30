# Development Guide

This guide helps developers get started with SHADOW project development.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js 16+** and npm/pnpm/yarn
- **Python 3.8+** with pip
- **Docker** and Docker Compose
- **Git** for version control

### Initial Setup

1. **Clone the repository:**
```bash
git clone https://github.com/Babilya/SHADOW.git
cd SHADOW
```

2. **Install root dependencies:**
```bash
npm install
```

3. **Set up QuantumX project:**
```bash
cd quantumx
npm install
```

4. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Run initial checks:**
```bash
./scripts/automated_checks.sh
```

## Development Workflow

### 1. Branch Management

Create feature branches for new work:
```bash
git checkout -b feature/your-feature-name
```

### 2. Code Changes

Make your changes following the coding standards:
- JavaScript/TypeScript: Follow ESLint and Prettier configs
- Python: Follow PEP 8 and use type hints
- Documentation: Update relevant docs

### 3. Testing

Run tests before committing:
```bash
# Run all automated checks
./scripts/automated_checks.sh

# Run specific tests
cd quantumx && npm test
cd quantumx/apps/backend && python -m pytest tests/
```

### 4. Commit

Use conventional commit messages:
```bash
git add .
git commit -m "feat: add new feature description"
```

## Project Structure

Understanding the codebase organization:

```
SHADOW/
├── docs/                 # Documentation
├── src/                  # Source code organization
├── tests/                # Test suites
├── quantumx/             # QuantumX monorepo
│   ├── apps/
│   │   ├── backend/      # FastAPI backend
│   │   ├── bot/          # Telegram bot
│   │   └── web/          # Web frontend
│   └── packages/
│       ├── shared/       # Shared utilities
│       ├── bot/          # Bot packages
│       └── webapp/       # Web app packages
└── scripts/              # Automation scripts
```

## Development Environment

### Using Docker

Start the development environment:
```bash
cd quantumx
docker-compose up -d
```

### Local Development

For local development without Docker:

1. **Start the backend:**
```bash
cd quantumx/apps/backend
uvicorn quantumx_api.main:app --reload
```

2. **Start the bot:**
```bash
cd quantumx/packages/bot
npm run dev
```

3. **Start the web app:**
```bash
cd quantumx/apps/web
npm run dev
```

## Debugging

### Backend Debugging

Use Python debugger:
```python
import pdb; pdb.set_trace()
```

Or use your IDE's debugger configuration.

### Frontend Debugging

Use browser developer tools and:
```javascript
console.log('Debug info:', data);
debugger; // Browser breakpoint
```

### Bot Debugging

Check logs and use console output:
```javascript
console.log('Bot event:', event);
```

## Code Quality

### Linting

Run linters before committing:
```bash
# JavaScript/TypeScript
npm run lint

# Python
cd quantumx/apps/backend
flake8 src/
black src/
```

### Type Checking

Ensure type safety:
```bash
# TypeScript
npm run type-check

# Python
cd quantumx/apps/backend
mypy src/
```

## Common Tasks

### Adding a New API Endpoint

1. Add route to `quantumx/apps/backend/src/quantumx_api/routers/`
2. Update main.py to include the router
3. Add tests in `quantumx/apps/backend/tests/`
4. Update API documentation

### Adding a New Bot Command

1. Add command handler in bot package
2. Update command documentation
3. Add tests for the command
4. Update help text

### Adding a New Frontend Component

1. Create component in appropriate directory
2. Add TypeScript types
3. Add tests
4. Update component documentation

## Performance Considerations

- Use async/await for I/O operations
- Implement proper caching strategies
- Monitor database query performance
- Optimize bundle sizes for frontend

## Security Best Practices

- Never commit secrets or API keys
- Use environment variables for configuration
- Validate all user inputs
- Implement proper authentication and authorization
- Keep dependencies updated

## Getting Help

- Check the documentation in `docs/`
- Review existing code for examples
- Ask questions in GitHub issues
- Contact the development team

## Useful Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Python Best Practices](https://docs.python.org/3/tutorial/)