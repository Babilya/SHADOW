# SHADOW

A comprehensive project repository containing advanced applications and tools.

## Overview

SHADOW is a multi-project repository that includes:

- **QuantumX**: A modern ecosystem combining Telegram WebApp with AI/OSINT platform capabilities
- **Automation Scripts**: Tools for automated checks and repository management

## Projects

### QuantumX Monorepo

Located in the `quantumx/` directory, QuantumX is a comprehensive project management system featuring:

- Telegram bot integration for project management
- Web application interface
- Backend API with FastAPI
- Real-time project tracking and task management
- AI/OSINT capabilities

For detailed QuantumX documentation, see [quantumx/README.md](quantumx/README.md).

## Installation

### Prerequisites

- Node.js (16+ recommended)
- Python 3.8+
- Docker and Docker Compose
- pnpm, npm, or yarn package manager

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/Babilya/SHADOW.git
cd SHADOW
```

2. Install dependencies:
```bash
# For QuantumX project
cd quantumx
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development environment:
```bash
# Using Docker Compose
docker-compose up -d

# Or run individual services
npm run dev
```

## Usage

### QuantumX Project Management

The QuantumX system provides comprehensive project management through both Telegram bot commands and web interface:

#### Bot Commands
- `/projects` - List all your projects
- `/newproject TITLE` - Create a new project
- `/project ID` - View project details
- `/addtask PROJECT_ID TITLE` - Add a task to a project
- `/complete PROJECT_ID TASK_ID` - Mark a task as completed
- `/projectstats` - View project statistics

#### API Endpoints
- `GET /projects?userId=ID` - List user projects
- `POST /projects` - Create a new project
- `GET /projects/:id?userId=ID` - Get project details
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id?userId=ID` - Delete project

### Automation Scripts

Run automated checks for the repository:
```bash
./scripts/automated_checks.sh
```

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run specific project tests
cd quantumx
npm test

# Run Python backend tests
cd quantumx/apps/backend
python -m pytest tests/
```

### Building

```bash
# Build all projects
cd quantumx
npm run build

# Build specific components
npm run build:web
npm run build:bot
```

## Architecture

The repository follows a modular architecture:

```
SHADOW/
├── docs/                 # Documentation
├── src/                  # Source code organization
├── tests/                # Test suites
├── quantumx/             # QuantumX monorepo
│   ├── apps/             # Applications (backend, bot, web)
│   ├── packages/         # Shared packages
│   └── docker-compose.yml
└── scripts/              # Utility scripts
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions and support:

1. Check the documentation in the `docs/` folder
2. Review existing issues on GitHub
3. Create a new issue with detailed information about your problem

## Roadmap

- [ ] Enhanced AI/OSINT capabilities
- [ ] Mobile application development
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Enterprise features