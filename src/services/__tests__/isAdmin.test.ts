import { describe, it, expect } from 'vitest';
import { isAdminTEST } from '../isAdmin';

describe('isAdminTEST', () => {
    it('returns true regardless of input', async () => {
        expect(await isAdminTEST('admin')).toBe(true);
        expect(await isAdminTEST('user')).toBe(true);
        expect(await isAdminTEST('')).toBe(true);
    });
});
