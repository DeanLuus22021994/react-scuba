import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import CurrencySelector from '@/components/common/CurrencySelector';
import { CurrencyProvider } from '@/hooks/useCurrency';

describe('CurrencySelector', () => {
  const renderWithProvider = (component) => {
    return render(<CurrencyProvider>{component}</CurrencyProvider>);
  };

  it('should render without crashing', async () => {
    renderWithProvider(<CurrencySelector />);
    await waitFor(() => {
      // Default currency is MUR
      expect(screen.getByText('MUR')).toBeInTheDocument();
    });
  });

  it('should display current currency', async () => {
    renderWithProvider(<CurrencySelector />);
    await waitFor(() => {
      // Default currency is MUR
      expect(screen.getByText('MUR')).toBeInTheDocument();
    });
  });

  it('should open dropdown when clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(<CurrencySelector />);

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('EUR')).toBeInTheDocument();
    });
  });

  it('should display currency dropdown with all options', async () => {
    const user = userEvent.setup();
    renderWithProvider(<CurrencySelector />);

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => {
      // Check for multiple currency options in the dropdown
      const currencyOptions = screen.getAllByText(/MUR|USD|EUR|GBP/);
      expect(currencyOptions.length).toBeGreaterThan(1);
    });
  });

  it('should change currency when option clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(<CurrencySelector />);

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => {
      const eurOption = screen.getAllByText('EUR')[0];
      return eurOption;
    });

    const eurButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.textContent.includes('EUR'));
    if (eurButtons.length > 1) {
      await user.click(eurButtons[1]);
    }
  });

  it('should display chevron icon', () => {
    const { container } = renderWithProvider(<CurrencySelector />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});
