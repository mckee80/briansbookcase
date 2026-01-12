import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmailVerificationModal from '@/components/EmailVerificationModal';

describe('EmailVerificationModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    email: 'test@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(<EmailVerificationModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Verify Your Email')).not.toBeInTheDocument();
  });

  it('should render the modal when isOpen is true', () => {
    render(<EmailVerificationModal {...defaultProps} />);
    expect(screen.getByText('Verify Your Email')).toBeInTheDocument();
  });

  it('should display the user email address', () => {
    render(<EmailVerificationModal {...defaultProps} email="user@example.com" />);
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
  });

  it('should display Supabase Auth sender information', () => {
    render(<EmailVerificationModal {...defaultProps} />);
    expect(screen.getByText('Supabase Auth')).toBeInTheDocument();
  });

  it('should display verification instructions', () => {
    render(<EmailVerificationModal {...defaultProps} />);
    expect(screen.getByText(/You must verify your email before you can access the library/)).toBeInTheDocument();
    expect(screen.getByText(/Check your inbox for an email from/)).toBeInTheDocument();
    expect(screen.getByText(/Click the verification link in the email/)).toBeInTheDocument();
  });

  it('should display spam folder reminder', () => {
    render(<EmailVerificationModal {...defaultProps} />);
    expect(screen.getByText(/Check your spam folder/)).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<EmailVerificationModal {...defaultProps} onClose={onClose} />);

    const closeButton = screen.getByRole('button', { name: '' }); // X button
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when Got It button is clicked', () => {
    const onClose = jest.fn();
    render(<EmailVerificationModal {...defaultProps} onClose={onClose} />);

    const gotItButton = screen.getByText('Got It');
    fireEvent.click(gotItButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should display mail icon', () => {
    const { container } = render(<EmailVerificationModal {...defaultProps} />);
    // Check for Mail icon SVG
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should display checkmark icons for each instruction step', () => {
    const { container } = render(<EmailVerificationModal {...defaultProps} />);
    // There should be multiple SVG icons (Mail icon + CheckCircle icons)
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(2);
  });

  it('should handle very long email addresses', () => {
    const longEmail = 'verylongemailaddress123456789@verylongdomainname123456789.com';
    render(<EmailVerificationModal {...defaultProps} email={longEmail} />);
    expect(screen.getByText(longEmail)).toBeInTheDocument();
  });
});
