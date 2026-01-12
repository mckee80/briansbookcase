# Testing Documentation

This document provides comprehensive information about the test suite for Brian's Bookcase application.

## Table of Contents

- [Overview](#overview)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Writing Tests](#writing-tests)
- [Test Files](#test-files)

## Overview

Brian's Bookcase uses **Jest** as the testing framework and **React Testing Library** for component testing. The test suite ensures the application works correctly and prevents regressions.

### Technologies

- **Jest** - JavaScript testing framework
- **React Testing Library** - React component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers for DOM nodes
- **@testing-library/user-event** - User interaction simulation

## Test Structure

Tests are organized in the `__tests__` directory with the following structure:

```
__tests__/
├── app/              # Page component tests
├── components/       # UI component tests
├── features/         # Feature integration tests
├── lib/             # Utility function tests
└── utils/           # Helper function tests
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Watch Mode

Run tests in watch mode (re-runs on file changes):

```bash
npm run test:watch
```

### Coverage Report

Generate a test coverage report:

```bash
npm run test:coverage
```

This will create a coverage report in the `coverage/` directory and display a summary in the terminal.

### Run Specific Tests

Run tests matching a pattern:

```bash
npm test -- <pattern>
```

Examples:
```bash
npm test -- Navbar           # Run Navbar tests
npm test -- components       # Run all component tests
npm test -- SendToDevice     # Run SendToDeviceModal tests
```

## Test Coverage

### Current Coverage

The test suite currently includes **46+ tests** covering:

- ✅ Component rendering and behavior
- ✅ User interactions
- ✅ Form validation
- ✅ Authentication flows
- ✅ Admin access control
- ✅ Tier selection logic
- ✅ Account deletion
- ✅ Email verification
- ✅ Device email management

### Coverage Goals

We aim for:
- **80%+ line coverage**
- **80%+ branch coverage**
- **100% coverage** for critical paths (authentication, payments, data deletion)

## Writing Tests

### Component Test Template

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what users see and do
   - Avoid testing internal state or implementation details

2. **Use Accessible Queries**
   - Prefer `getByRole`, `getByLabelText`, `getByText`
   - Avoid `getByTestId` when possible

3. **Mock External Dependencies**
   - Mock API calls, database queries, and external services
   - Use `jest.mock()` for module mocking

4. **Test Edge Cases**
   - Empty states
   - Error conditions
   - Loading states
   - Invalid inputs

5. **Keep Tests Isolated**
   - Each test should be independent
   - Use `beforeEach` to reset state
   - Clean up after tests

## Test Files

### Component Tests

#### Navbar (`__tests__/components/Navbar.test.tsx`)
- ✅ Renders navigation links
- ✅ Shows login/join buttons for unauthenticated users
- ✅ Shows profile dropdown for authenticated users
- ✅ Displays admin link for admin users
- ✅ Handles sign out

#### SendToDeviceModal (`__tests__/components/SendToDeviceModal.test.tsx`)
- ✅ Modal visibility control
- ✅ Displays instructions for Kindle users
- ✅ Shows Amazon help link
- ✅ Loads saved device email
- ✅ Handles form submission
- ✅ Displays success/error messages
- ✅ Loading states
- ✅ Form validation

#### EmailVerificationModal (`__tests__/components/EmailVerificationModal.test.tsx`)
- ✅ Modal rendering
- ✅ Displays user email
- ✅ Shows verification instructions
- ✅ Supabase Auth sender information
- ✅ Close button functionality
- ✅ Handles long email addresses

### Page Tests

#### Membership (`__tests__/app/membership.test.tsx`)
- ✅ Renders tier selection
- ✅ Displays signup form
- ✅ Tier switching
- ✅ Form validation
- ✅ Password confirmation

### Feature Tests

#### Signup Flow (`__tests__/features/signupFlow.test.ts`)
- ✅ Complete signup process
- ✅ Email verification requirement
- ✅ Tier selection during signup
- ✅ Password validation
- ✅ Error handling

#### Account Deletion (`__tests__/features/accountDeletion.test.ts`)
- ✅ Account deletion flow
- ✅ Confirmation requirement
- ✅ Data cleanup
- ✅ Redirect after deletion

### Utility Tests

#### Tier Logic (`__tests__/utils/tierLogic.test.ts`)
- ✅ Tier comparison
- ✅ Price calculations
- ✅ Feature access validation

#### Admin Check (`__tests__/lib/adminCheck.test.ts`)
- ✅ Admin user identification
- ✅ Access control
- ✅ Edge cases (null/undefined users)

## Continuous Integration

Tests are run automatically on:
- Every commit (via pre-commit hooks if configured)
- Pull requests
- Deployment to production

## Troubleshooting

### Tests Failing Locally

1. **Clear Jest cache:**
   ```bash
   npx jest --clearCache
   ```

2. **Ensure dependencies are installed:**
   ```bash
   npm install
   ```

3. **Check for environment variables:**
   - Ensure `.env.local` is properly configured
   - Test environment uses separate config

### Slow Tests

1. **Run tests in parallel (default):**
   ```bash
   npm test -- --maxWorkers=4
   ```

2. **Run only changed tests:**
   ```bash
   npm test -- --onlyChanged
   ```

### Coverage Issues

1. **View detailed coverage report:**
   ```bash
   npm run test:coverage
   open coverage/lcov-report/index.html
   ```

2. **Identify uncovered lines:**
   - Open coverage report in browser
   - Navigate to specific files
   - Red highlights show uncovered code

## Adding New Tests

When adding new features:

1. **Create test file** in appropriate `__tests__/` subdirectory
2. **Write tests** before or alongside implementation (TDD)
3. **Run tests** to ensure they pass
4. **Check coverage** to identify gaps
5. **Document** any special test setup requirements

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Accessible Queries](https://testing-library.com/docs/queries/about#priority)

## Contributing

When contributing tests:

1. Follow existing patterns and conventions
2. Ensure all tests pass before committing
3. Maintain or improve code coverage
4. Add meaningful test descriptions
5. Document complex test setups

---

**Last Updated:** January 2026
**Test Suite Version:** 1.0
**Total Tests:** 46+
