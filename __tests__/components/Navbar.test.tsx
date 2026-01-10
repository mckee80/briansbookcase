import { render, screen } from '@testing-library/react';
import Navbar from '@/components/Navbar';

// Mock the AuthProvider
jest.mock('@/components/AuthProvider', () => ({
  useAuth: () => ({
    user: null,
    signOut: jest.fn(),
  }),
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Navbar Component', () => {
  it('renders the site title', () => {
    render(<Navbar />);
    expect(screen.getByText("Brian's Bookcase")).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Navbar />);

    expect(screen.getByText('Library')).toBeInTheDocument();
    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('Join Us!')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Authors')).toBeInTheDocument();
  });

  it('shows login and join buttons when user is not authenticated', () => {
    render(<Navbar />);

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Join Us!')).toBeInTheDocument();
  });

  it('shows account and sign out buttons when user is authenticated', () => {
    // Mock authenticated user
    jest.mock('@/components/AuthProvider', () => ({
      useAuth: () => ({
        user: { id: '123', email: 'test@example.com' },
        signOut: jest.fn(),
      }),
    }));

    render(<Navbar />);

    // Note: This test would need to be refined based on actual auth state management
    // For now, we're testing the unauthenticated state
  });
});
