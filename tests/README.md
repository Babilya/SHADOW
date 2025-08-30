# Test Suite

This directory contains comprehensive test suites for the SHADOW project.

## Structure

```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/           # End-to-end tests
├── fixtures/      # Test data and fixtures
├── utils/         # Test utilities and helpers
└── README.md      # This file
```

## Running Tests

### All Tests
```bash
# From repository root
npm test

# Run tests with coverage
npm run test:coverage
```

### Specific Test Suites

#### Unit Tests
```bash
npm run test:unit
```

#### Integration Tests
```bash
npm run test:integration
```

#### End-to-End Tests
```bash
npm run test:e2e
```

#### Python Backend Tests
```bash
cd quantumx/apps/backend
python -m pytest tests/
```

## Test Organization

### Unit Tests (`unit/`)
- Test individual functions and modules in isolation
- Mock external dependencies
- Focus on business logic validation

### Integration Tests (`integration/`)
- Test interactions between modules
- Test API endpoints with real database
- Validate data flow between components

### End-to-End Tests (`e2e/`)
- Test complete user workflows
- Validate UI interactions
- Test cross-service communication

## Writing Tests

### JavaScript/TypeScript Tests
We use Jest for JavaScript/TypeScript testing:

```javascript
// Example unit test
describe('ProjectService', () => {
  it('should create a new project', async () => {
    const project = await ProjectService.create({
      title: 'Test Project',
      description: 'Test Description'
    });
    
    expect(project.id).toBeDefined();
    expect(project.title).toBe('Test Project');
  });
});
```

### Python Tests
We use pytest for Python testing:

```python
# Example unit test
import pytest
from quantumx_api.services.project import ProjectService

def test_create_project():
    project = ProjectService.create({
        'title': 'Test Project',
        'description': 'Test Description'
    })
    
    assert project.id is not None
    assert project.title == 'Test Project'
```

## Test Configuration

### Jest Configuration
Located in `jest.config.js` (see quantumx package configuration)

### Pytest Configuration
Located in `pytest.ini` or `pyproject.toml` (see backend configuration)

## Test Data

Use the `fixtures/` directory for:
- Sample data files
- Mock responses
- Test database seeds
- Configuration files for testing

## Continuous Integration

Tests are automatically run on:
- Pull requests
- Pushes to main branch
- Scheduled nightly builds

## Coverage Requirements

Maintain minimum test coverage:
- Unit tests: 80%
- Integration tests: 70%
- Overall project: 75%

## Best Practices

1. **Naming**: Use descriptive test names that explain what is being tested
2. **Isolation**: Each test should be independent and not rely on other tests
3. **Cleanup**: Clean up resources after tests (database, files, etc.)
4. **Mocking**: Mock external services and dependencies in unit tests
5. **Performance**: Keep tests fast and efficient
6. **Documentation**: Comment complex test scenarios

## Troubleshooting

### Common Issues

#### Tests Timing Out
- Increase timeout values for integration tests
- Check for hanging promises or connections

#### Database Issues
- Ensure test database is properly configured
- Check that migrations are applied

#### Flaky Tests
- Add proper waits for async operations
- Use deterministic test data
- Check for race conditions

## Getting Help

- Check existing test files for examples
- Review the testing documentation in `docs/development/`
- Ask questions in GitHub issues
- Contact the development team