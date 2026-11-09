import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import ProductsPage from './ProductsPage';
import { CartContext } from '../context/CartContext';

vi.mock('./Header', () => ({ default: () => <header /> }));
vi.mock('./Footer', () => ({ default: () => <footer /> }));

const product = {
    id: 'apple',
    name: 'Apple',
    price: 1.5,
    description: 'Fresh apple',
    image: 'apple.png',
    reviews: [],
    inStock: true
};

const outOfStockProduct = { ...product, id: 'pear', name: 'Pear', inStock: false };
const renderProducts = (addToCart = vi.fn()) => render(
    <CartContext.Provider value={{ cartItems: [], addToCart, clearCart: vi.fn() }}>
        <ProductsPage />
    </CartContext.Provider>
);

describe('ProductsPage', () => {
    beforeEach(() => {
        let fetchIndex = 0;
        vi.stubGlobal('fetch', vi.fn((url: string) => Promise.resolve({
            ok: true,
            json: () => Promise.resolve(fetchIndex++ === 0
                ? product
                : { ...outOfStockProduct, id: url })
        })));
    });

    afterEach(() => vi.unstubAllGlobals());

    it('shows loading then renders fetched products and supports adding items', async () => {
        const user = userEvent.setup();
        const addToCart = vi.fn();
        renderProducts(addToCart);

        expect(screen.getByText('Loading products...')).toBeInTheDocument();
        await waitFor(() => expect(screen.getByText('Our Products')).toBeInTheDocument());
        expect(screen.getAllByRole('button', { name: 'Add to Cart' })).toHaveLength(1);
        await user.click(screen.getAllByRole('button', { name: 'Add to Cart' })[0]);
        expect(addToCart).toHaveBeenCalledWith(product);
        expect(screen.getByRole('heading', { name: 'Apple' })).toBeInTheDocument();
    });

    it('disables out-of-stock products and handles product reviews', async () => {
        const user = userEvent.setup();
        renderProducts();
        await waitFor(() => expect(screen.getByText('Our Products')).toBeInTheDocument());

        expect(screen.getAllByRole('button', { name: 'Out of Stock' })).toHaveLength(3);
        await user.click(screen.getAllByAltText('Apple')[0]);
        expect(screen.getByText('Reviews for Apple')).toBeInTheDocument();
        await user.type(screen.getByPlaceholderText('Your name'), 'Alex');
        await user.type(screen.getByPlaceholderText('Your review'), 'Delicious');
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        expect(screen.getByText(/Alex/)).toBeInTheDocument();
    });

    it('stops loading when product loading fails', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false, json: vi.fn() })));
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        renderProducts();

        await waitFor(() => expect(screen.getByText('Our Products')).toBeInTheDocument());
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        errorSpy.mockRestore();
    });
});
