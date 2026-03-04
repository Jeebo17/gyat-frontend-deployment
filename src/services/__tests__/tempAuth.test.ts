import { describe, it, expect } from 'vitest';
import { authenticateTempUser } from '../tempAuth';

describe('authenticateTempUser', () => {
    it('returns ok: true for valid credentials', () => {
        const result = authenticateTempUser('admin@gyat.com', 'admin');
        expect(result.ok).toBe(true);
        expect(result.userName).toBe('Admin');
    });

    it('returns ok: false for wrong email', () => {
        const result = authenticateTempUser('wrong@email.com', 'admin');
        expect(result.ok).toBe(false);
        expect(result.userName).toBe('');
    });

    it('returns ok: false for wrong password', () => {
        const result = authenticateTempUser('admin@gyat.com', 'wrong');
        expect(result.ok).toBe(false);
        expect(result.userName).toBe('');
    });

    it('returns ok: false for both wrong', () => {
        const result = authenticateTempUser('wrong@email.com', 'wrong');
        expect(result.ok).toBe(false);
        expect(result.userName).toBe('');
    });

    it('returns ok: false for empty strings', () => {
        const result = authenticateTempUser('', '');
        expect(result.ok).toBe(false);
        expect(result.userName).toBe('');
    });

    it('is case-sensitive for email', () => {
        const result = authenticateTempUser('Admin@gyat.com', 'admin');
        expect(result.ok).toBe(false);
    });

    it('is case-sensitive for password', () => {
        const result = authenticateTempUser('admin@gyat.com', 'Admin');
        expect(result.ok).toBe(false);
    });
});
