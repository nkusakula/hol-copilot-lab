import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import CartPage from './CartPage';
import { CartContext, CartItem } from '../context/CartContext';

// Mock components
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('./CheckoutModal', () => ({
    default: ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
        <div role="dialog" aria-label="Checkout">
            <button onClick={onConfirm}>Confirm checkout</button>
            <button onClick={onCancel}>Cancel checkout</button>
        </div>
    )
}));

const mockCartItems: CartItem[] = [
    {
        id: '1',
        name: 'Test Product 1',
        price: 29.99,
        quantity: 2,
        image: 'test1.jpg',
        reviews: [],
        inStock: true
    },
    {
        id: '2',
        name: 'Test Product 2',
        price: 49.99,
        quantity: 1,
        image: 'test2.jpg',
        reviews: [],
        inStock: true
    }
];

const createCartContext = (cartItems: CartItem[] = mockCartItems) => ({
    cartItems,
    addToCart: vi.fn(),
    clearCart: vi.fn()
});

const renderWithCartContext = (cartContext = createCartContext()) => {
    return render(
        <CartContext.Provider value={cartContext}>
            <CartPage />
        </CartContext.Provider>
    );
};

describe('CartPage', () => {
    it('displays cart items when cart has items', () => {
        renderWithCartContext();

        expect(screen.getByRole('heading', { name: 'Your Cart' })).toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
        expect(screen.getByText('Price: $49.99')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
    });

    it('displays empty cart message when cart has no items', () => {
        renderWithCartContext(createCartContext([]));

        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Checkout' })).not.toBeInTheDocument();
    });

    it('opens the checkout dialog when checkout is selected', async () => {
        const user = userEvent.setup();
        renderWithCartContext();

        await user.click(screen.getByRole('button', { name: 'Checkout' }));

        expect(screen.getByRole('dialog', { name: 'Checkout' })).toBeInTheDocument();
    });

    it('closes the checkout dialog without clearing the cart when canceled', async () => {
        const user = userEvent.setup();
        const cartContext = createCartContext();
        renderWithCartContext(cartContext);

        await user.click(screen.getByRole('button', { name: 'Checkout' }));
        await user.click(screen.getByRole('button', { name: 'Cancel checkout' }));

        expect(screen.queryByRole('dialog', { name: 'Checkout' })).not.toBeInTheDocument();
        expect(cartContext.clearCart).not.toHaveBeenCalled();
        expect(screen.getByRole('button', { name: 'Checkout' })).toBeInTheDocument();
    });

    it('clears the cart and displays the processed order after checkout confirmation', async () => {
        const user = userEvent.setup();
        const cartContext = createCartContext();
        renderWithCartContext(cartContext);

        await user.click(screen.getByRole('button', { name: 'Checkout' }));
        await user.click(screen.getByRole('button', { name: 'Confirm checkout' }));

        expect(cartContext.clearCart).toHaveBeenCalledOnce();
        expect(screen.getByRole('heading', { name: 'Your order has been processed!' })).toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    it('throws a clear error when rendered without a cart provider', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

        try {
            expect(() => render(<CartPage />)).toThrow(
                'CartContext must be used within a CartProvider'
            );
        } finally {
            consoleError.mockRestore();
        }
    });
});
