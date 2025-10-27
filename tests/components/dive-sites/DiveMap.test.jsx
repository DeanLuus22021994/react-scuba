import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import DiveMap from '../../../src/features/dive-sites/components/DiveMap';

// Mock react-leaflet
vi.mock('react-leaflet', () => ({
  MapContainer: vi.fn(({ children }) => <div data-testid="map-container">{children}</div>),
  TileLayer: vi.fn(() => <div data-testid="tile-layer" />),
  Marker: vi.fn(() => <div data-testid="marker" />),
  Popup: vi.fn(({ children }) => <div data-testid="popup">{children}</div>),
  useMap: vi.fn(() => ({ flyTo: vi.fn() })),
}));

describe('DiveMap', () => {
  const mockOnMarkerClick = vi.fn();

  it('should render without crashing', () => {
    const { container } = render(<DiveMap onMarkerClick={mockOnMarkerClick} />);
    expect(container).toBeInTheDocument();
  });

  it('should render map container', () => {
    const { getByTestId } = render(<DiveMap onMarkerClick={mockOnMarkerClick} />);
    expect(getByTestId('map-container')).toBeInTheDocument();
  });

  it('should accept selectedSite prop', () => {
    const selectedSite = {
      id: 'test-site',
      coordinates: [-20.2833, 57.5833],
    };
    const { container } = render(<DiveMap selectedSite={selectedSite} onMarkerClick={mockOnMarkerClick} />);
    expect(container).toBeInTheDocument();
  });
});
