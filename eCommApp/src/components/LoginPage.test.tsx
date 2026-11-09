import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import LoginPage from './LoginPage';

const navigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return { ...actual, useNavigate: () => navigate };
});

vi.mock('./Header', () => ({ default: () => <header /> }));
vi.mock('./Footer', () => ({ default: () => <footer /> }));

describe('LoginPage', () => {
    it('shows an error for invalid credentials', async () => {
        const user = userEvent.setup();
        render(<LoginPage />, { wrapper: BrowserRouter });

        await user.type(screen.getByPlaceholderText('Username'), 'wrong');
        await user.type(screen.getByPlaceholderText('Password'), 'credentials');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('navigates to admin and clears fields for valid credentials', async () => {
        const user = userEvent.setup();
        navigate.mockClear();
        render(<LoginPage />, { wrapper: BrowserRouter });

        const username = screen.getByPlaceholderText('Username');
        const password = screen.getByPlaceholderText('Password');
        await user.type(username, 'admin');
        await user.type(password, 'admin');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        expect(navigate).toHaveBeenCalledWith('/admin');
        expect(username).toHaveValue('');
        expect(password).toHaveValue('');
    });
});
