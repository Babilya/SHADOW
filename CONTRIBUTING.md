# Contributing to SHADOW

We love your input! We want to make contributing to SHADOW as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](LICENSE) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using GitHub's [issues](https://github.com/Babilya/SHADOW/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/Babilya/SHADOW/issues/new); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

People *love* thorough bug reports. I'm not even kidding.

## Development Setup

### Prerequisites

- Node.js 16+ and npm/pnpm/yarn
- Python 3.8+
- Docker and Docker Compose
- Git

### Local Development

1. Fork and clone the repository:
```bash
git clone https://github.com/your-username/SHADOW.git
cd SHADOW
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install QuantumX dependencies
cd quantumx
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your local configuration
```

4. Run the automated checks to ensure everything is set up correctly:
```bash
./scripts/automated_checks.sh
```

### Project Structure

Please familiarize yourself with the project structure:

- `docs/` - Documentation files
- `src/` - Source code organization
- `tests/` - Test suites
- `quantumx/` - QuantumX monorepo with apps and packages
- `scripts/` - Utility and automation scripts

### Coding Standards

#### JavaScript/TypeScript
- Use ESLint configuration provided in the project
- Follow Prettier formatting rules
- Use meaningful variable and function names
- Write JSDoc comments for public APIs

#### Python
- Follow PEP 8 style guidelines
- Use type hints where appropriate
- Write docstrings for functions and classes
- Use pytest for testing

#### General
- Write clear, self-documenting code
- Add comments for complex logic
- Keep functions small and focused
- Use descriptive commit messages

### Testing

Before submitting a pull request:

1. Run all tests:
```bash
# Run automated checks
./scripts/automated_checks.sh

# Run specific tests
cd quantumx
npm test

# Run Python tests
cd quantumx/apps/backend
python -m pytest tests/
```

2. Add tests for new functionality
3. Ensure all tests pass
4. Check code coverage remains high

### Commit Message Guidelines

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

Examples:
```
feat(api): add project statistics endpoint
fix(bot): resolve issue with task completion
docs(readme): update installation instructions
```

### Submitting Changes

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:
```bash
git add .
git commit -m "feat: add your feature description"
```

3. Push to your fork:
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request with:
   - Clear title and description
   - Link to any related issues
   - Screenshots for UI changes
   - Test results

### Code Review Process

1. All pull requests require review from maintainers
2. We may suggest changes, improvements, or alternatives
3. Please respond to feedback promptly
4. Once approved, a maintainer will merge your PR

### Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the code of conduct
- Ask questions when in doubt

### Getting Help

- Check existing documentation in `docs/`
- Search existing issues and pull requests
- Join our community discussions
- Create an issue for bugs or feature requests

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions make SHADOW better for everyone. Thank you for taking the time to contribute!