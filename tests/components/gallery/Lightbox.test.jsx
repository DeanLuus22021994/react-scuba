import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Lightbox from '../../../src/features/gallery/components/Lightbox';

describe('Lightbox', () => {
  const mockImage = {
    id: 1,
    url: 'https://example.com/image.jpg',
    title: 'Test Image',
    description: 'Test description',
    category: 'Marine Life',
  };

  const mockOnClose = vi.fn();
  const mockOnNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when not open', () => {
    render(<Lightbox image={mockImage} isOpen={false} onClose={mockOnClose} onNavigate={mockOnNavigate} />);
    expect(screen.queryByText(mockImage.title)).not.toBeInTheDocument();
  });

  it('should render when open', () => {
    render(<Lightbox image={mockImage} isOpen onClose={mockOnClose} onNavigate={mockOnNavigate} />);
    expect(screen.getByText(mockImage.title)).toBeInTheDocument();
  });

  it('should display image details', () => {
    render(<Lightbox image={mockImage} isOpen onClose={mockOnClose} onNavigate={mockOnNavigate} />);
    expect(screen.getByText(mockImage.title)).toBeInTheDocument();
    expect(screen.getByText(mockImage.description)).toBeInTheDocument();
    expect(screen.getByText(mockImage.category)).toBeInTheDocument();
  });

  it('should call onClose when close button clicked', async () => {
    const user = userEvent.setup();
    render(<Lightbox image={mockImage} isOpen onClose={mockOnClose} onNavigate={mockOnNavigate} />);

    const closeButton = screen.getByLabelText('Close lightbox');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onNavigate with prev when previous button clicked', async () => {
    const user = userEvent.setup();
    render(<Lightbox image={mockImage} isOpen onClose={mockOnClose} onNavigate={mockOnNavigate} />);

    const prevButton = screen.getByLabelText('Previous image');
    await user.click(prevButton);

    expect(mockOnNavigate).toHaveBeenCalledWith('prev');
  });

  it('should call onNavigate with next when next button clicked', async () => {
    const user = userEvent.setup();
    render(<Lightbox image={mockImage} isOpen onClose={mockOnClose} onNavigate={mockOnNavigate} />);

    const nextButton = screen.getByLabelText('Next image');
    await user.click(nextButton);

    expect(mockOnNavigate).toHaveBeenCalledWith('next');
  });

  it('should render image element', () => {
    render(<Lightbox image={mockImage} isOpen onClose={mockOnClose} onNavigate={mockOnNavigate} />);
    const img = screen.getByAltText(mockImage.title);
    expect(img).toHaveAttribute('src', mockImage.url);
  });
});
