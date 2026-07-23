import type { Mocked } from 'vitest';
import { vi } from 'vitest';

export function mockClass<T>(names: (keyof T)[]): Mocked<T> {
    const obj = {} as Mocked<any>;
    for (let prop of names) {
        obj[prop] = vi.fn();
    }
    return obj;
}
