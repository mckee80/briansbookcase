import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SendToDeviceModal from '@/components/SendToDeviceModal';

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(() => Promise.resolve({
        data: { user: { user_metadata: { device_email: 'test@kindle.com' } } }
      })),
    },
  })),
}));

// Mock fetch
global.fetch = jest.fn();

describe('SendToDeviceModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    ebookId: 1,
    ebookTitle: 'Test Book',
    userId: 'test-user-id',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(<SendToDeviceModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Send to Device')).not.toBeInTheDocument();
  });

  it('should render the modal when isOpen is true', () => {
    render(<SendToDeviceModal {...defaultProps} />);
    expect(screen.getByText('Send to Device')).toBeInTheDocument();
  });

  it('should display "How it works" instructions', () => {
    render(<SendToDeviceModal {...defaultProps} />);
    expect(screen.getByText(/How it works:/)).toBeInTheDocument();
    expect(screen.getByText(/yourname@kindle.com/)).toBeInTheDocument();
  });

  it('should display Kindle approved email instructions', () => {
    render(<SendToDeviceModal {...defaultProps} />);
    expect(screen.getByText(/Kindle Users:/)).toBeInTheDocument();
    expect(screen.getByText(/library@mail.briansbookcase.org/)).toBeInTheDocument();
  });

  it('should have a link to Amazon help documentation', () => {
    render(<SendToDeviceModal {...defaultProps} />);
    const link = screen.getByText(/Click here for instructions/);
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute(
      'href',
      'https://www.amazon.com/gp/help/customer/display.html?nodeId=GX9XLEVV8G4DB28H'
    );
    expect(link.closest('a')).toHaveAttribute('target', '_blank');
  });

  it('should load saved device email on mount', async () => {
    render(<SendToDeviceModal {...defaultProps} />);
    await waitFor(() => {
      const input = screen.getByPlaceholderText('your.device@kindle.com') as HTMLInputElement;
      expect(input.value).toBe('test@kindle.com');
    });
  });

  it('should allow user to enter a device email', () => {
    render(<SendToDeviceModal {...defaultProps} />);
    const input = screen.getByPlaceholderText('your.device@kindle.com') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'newemail@kindle.com' } });
    expect(input.value).toBe('newemail@kindle.com');
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<SendToDeviceModal {...defaultProps} onClose={onClose} />);

    const closeButton = screen.getByRole('button', { name: '' }); // X button has no text
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when cancel button is clicked', () => {
    const onClose = jest.fn();
    render(<SendToDeviceModal {...defaultProps} onClose={onClose} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should submit form with device email', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    render(<SendToDeviceModal {...defaultProps} />);

    const input = screen.getByPlaceholderText('your.device@kindle.com');
    fireEvent.change(input, { target: { value: 'test@kindle.com' } });

    const submitButton = screen.getByText('Send Ebook');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/send-ebook', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ebookId: 1,
          deviceEmail: 'test@kindle.com',
          userId: 'test-user-id',
        }),
      }));
    });
  });

  it('should show success message after successful send', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    render(<SendToDeviceModal {...defaultProps} />);

    const input = screen.getByPlaceholderText('your.device@kindle.com');
    fireEvent.change(input, { target: { value: 'test@kindle.com' } });

    const submitButton = screen.getByText('Send Ebook');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email sent successfully!')).toBeInTheDocument();
      expect(screen.getByText(/Check your inbox for/)).toBeInTheDocument();
    });
  });

  it('should show error message on failed send', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Failed to send email' }),
    });

    render(<SendToDeviceModal {...defaultProps} />);

    const input = screen.getByPlaceholderText('your.device@kindle.com');
    fireEvent.change(input, { target: { value: 'test@kindle.com' } });

    const submitButton = screen.getByText('Send Ebook');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to send email')).toBeInTheDocument();
    });
  });

  it('should disable submit button when no email is entered', () => {
    render(<SendToDeviceModal {...defaultProps} />);

    const input = screen.getByPlaceholderText('your.device@kindle.com') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '' } });

    const submitButton = screen.getByText('Send Ebook') as HTMLButtonElement;
    expect(submitButton).toBeDisabled();
  });

  it('should show loading state during submission', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => ({}) }), 100))
    );

    render(<SendToDeviceModal {...defaultProps} />);

    const input = screen.getByPlaceholderText('your.device@kindle.com');
    fireEvent.change(input, { target: { value: 'test@kindle.com' } });

    const submitButton = screen.getByText('Send Ebook');
    fireEvent.click(submitButton);

    expect(screen.getByText('Sending...')).toBeInTheDocument();
  });
});
