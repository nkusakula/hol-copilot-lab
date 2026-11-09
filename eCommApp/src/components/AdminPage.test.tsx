import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import AdminPage from './AdminPage';

vi.mock('./Header', () => ({ default: () => <header /> }));
vi.mock('./Footer', () => ({ default: () => <footer /> }));

describe('AdminPage', () => {
    it('activates a sale for a numeric percentage', async () => {
        const user = userEvent.setup();
        render(<AdminPage />, { wrapper: BrowserRouter });

        await user.clear(screen.getByLabelText(/Set Sale Percent/));
        await user.type(screen.getByLabelText(/Set Sale Percent/), '20');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText('All products are 20% off!')).toBeInTheDocument();
    });

    it('shows an error for non-numeric sale input and can end a sale', async () => {
        const user = userEvent.setup();
        render(<AdminPage />, { wrapper: BrowserRouter });
        const input = screen.getByLabelText(/Set Sale Percent/);

        await user.clear(input);
        await user.type(input, 'invalid');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText(/Invalid input/)).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'End Sale' }));
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });
});
