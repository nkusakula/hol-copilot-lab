import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CheckoutModal from './CheckoutModal';
import ReviewModal from './ReviewModal';

const product = {
    id: '1',
    name: 'Apple',
    price: 1,
    reviews: [],
    inStock: true
};

describe('CheckoutModal', () => {
    it('invokes confirmation and cancellation callbacks', async () => {
        const user = userEvent.setup();
        const onConfirm = vi.fn();
        const onCancel = vi.fn();
        render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);

        await user.click(screen.getByRole('button', { name: 'Continue Checkout' }));
        await user.click(screen.getByRole('button', { name: 'Return to cart' }));

        expect(onConfirm).toHaveBeenCalledOnce();
        expect(onCancel).toHaveBeenCalledOnce();
    });
});

describe('ReviewModal', () => {
    it('renders nothing without a selected product', () => {
        const { container } = render(
            <ReviewModal product={null} onClose={vi.fn()} onSubmit={vi.fn()} />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('submits a review and closes from the backdrop', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        const onSubmit = vi.fn();
        render(<ReviewModal product={product} onClose={onClose} onSubmit={onSubmit} />);

        await user.type(screen.getByPlaceholderText('Your name'), 'Sam');
        await user.type(screen.getByPlaceholderText('Your review'), 'Great fruit');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({ author: 'Sam', comment: 'Great fruit' })
        );
        await user.click(screen.getByRole('button', { name: 'Close' }));
        expect(onClose).toHaveBeenCalledOnce();
    });
});
