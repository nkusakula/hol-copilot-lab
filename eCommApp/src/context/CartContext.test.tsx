import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useContext } from 'react';
import { CartContext, CartProvider } from './CartContext';

const product = {
    id: 'apple',
    name: 'Apple',
    price: 1.5,
    image: 'apple.png',
    reviews: [],
    inStock: true
};

describe('CartProvider', () => {
    it('adds new products and increments products already in the cart', () => {
        const { result } = renderHook(() => useContext(CartContext), { wrapper: CartProvider });

        act(() => result.current?.addToCart(product));
        act(() => result.current?.addToCart(product));

        expect(result.current?.cartItems).toHaveLength(1);
        expect(result.current?.cartItems[0].quantity).toBe(2);
    });

    it('clears all products from the cart', () => {
        const { result } = renderHook(() => useContext(CartContext), { wrapper: CartProvider });

        act(() => result.current?.addToCart(product));
        act(() => result.current?.clearCart());

        expect(result.current?.cartItems).toEqual([]);
    });
});
