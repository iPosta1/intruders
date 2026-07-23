export function mockClass<T>(names: (keyof T)[]): jest.Mocked<T> {
    let obj = {} as jest.Mocked<any>;
    for (let prop of names) {
        obj[prop] = jest.fn();
    }
    return obj;
}
