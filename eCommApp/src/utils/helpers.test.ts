import { describe, expect, it } from 'vitest';
import { calculateTotal, formatPrice, validateEmail } from './helpers';

describe('helpers', () => {
    it('formats prices as US currency', () => {
        expect(formatPrice(12.5)).toBe('$12.50');
    });

    it('calculates a cart total from item prices and quantities', () => {
        expect(calculateTotal([{ price: 2.5, quantity: 2 }, { price: 4, quantity: 1 }])).toBe(9);
    });

    it('validates email addresses', () => {
        expect(validateEmail('person@example.com')).toBe(true);
        expect(validateEmail('invalid-email')).toBe(false);
    });
});
