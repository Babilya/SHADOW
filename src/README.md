# Source Code Organization

This directory contains organized source code for the SHADOW project.

## Structure

The source code is organized as follows:

```
src/
├── quantumx/          # QuantumX project source (symlink to ../quantumx)
├── shared/            # Shared utilities and libraries
├── tools/             # Development and build tools
└── README.md          # This file
```

## Current Organization

The main application source code is currently located in the `quantumx/` directory at the repository root. This `src/` folder provides a standard entry point and organization for future development.

### QuantumX Project

The QuantumX monorepo contains:

- **`apps/`** - Applications
  - `backend/` - FastAPI backend service
  - `bot/` - Telegram bot application
  - `web/` - Web application frontend

- **`packages/`** - Shared packages
  - `shared/` - Common types and utilities
  - `bot/` - Bot-specific packages
  - `webapp/` - Web app specific packages

### Shared Libraries

Future shared code that spans multiple projects should be placed in `src/shared/`.

### Tools and Utilities

Development tools, build scripts, and utilities should be organized in `src/tools/`.

## Future Reorganization

As the project grows, consider:

1. Moving `quantumx/` into `src/quantumx/`
2. Extracting common functionality into `src/shared/`
3. Creating project-specific directories for new projects
4. Establishing clear module boundaries

## Best Practices

1. **Module Structure**: Each module should have clear responsibilities
2. **Dependencies**: Minimize cross-module dependencies
3. **Exports**: Use clear, well-documented export patterns
4. **Types**: Leverage TypeScript for type safety
5. **Testing**: Co-locate tests with source code when appropriate

## Current Access

For now, the main source code can be accessed through:
- `../quantumx/` - Main QuantumX monorepo
- `../scripts/` - Automation and utility scripts

This organization provides a foundation for future development while maintaining the current working structure.