import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';
import Footer from './Footer';
import Header from './Header';
import HomePage from './HomePage';

describe('shared and home page components', () => {
    it('renders the home page content and footer', () => {
        render(<HomePage />, { wrapper: BrowserRouter });
        expect(screen.getByText('Welcome to the The Daily Harvest!')).toBeInTheDocument();
        expect(screen.getByText(/Check out our products page/)).toBeInTheDocument();
    });

    it('renders navigation and footer content', () => {
        render(
            <>
                <Header />
                <Footer />
            </>,
            { wrapper: BrowserRouter }
        );
        expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products');
        expect(screen.getByText(/2025 The Daily Harvest/)).toBeInTheDocument();
    });
});

describe('App', () => {
    it('renders the home route inside the cart provider', () => {
        window.history.pushState({}, '', '/');
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        expect(screen.getByText('Welcome to the The Daily Harvest!')).toBeInTheDocument();
    });
});
