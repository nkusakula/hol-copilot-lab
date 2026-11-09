import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';
import ContactPage from './ContactPage';

describe('ContactPage', () => {
    it('clears the form after submitting and closes the confirmation with Continue', async () => {
        const user = userEvent.setup();
        render(<ContactPage />, { wrapper: BrowserRouter });

        await user.type(screen.getByLabelText('Name'), 'Sam');
        await user.type(screen.getByLabelText('Email'), 'sam@example.com');
        await user.type(screen.getByLabelText('Request'), 'Please contact me');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByRole('dialog')).toHaveTextContent('Thank you for your message.');
        expect(screen.getByLabelText('Name')).toHaveValue('');
        expect(screen.getByLabelText('Email')).toHaveValue('');
        expect(screen.getByLabelText('Request')).toHaveValue('');

        await user.click(screen.getByRole('button', { name: 'Continue' }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('navigates to the contact form from the Contact Us button', async () => {
        const user = userEvent.setup();
        window.history.pushState({}, '', '/');
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        await user.click(screen.getByRole('button', { name: 'Contact Us' }));
        expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument();
        expect(screen.getByLabelText('Request')).toBeInTheDocument();
    });
});
