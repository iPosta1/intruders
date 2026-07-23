
export const checkGameId = () => {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function () {
            if (!arguments[0] || !arguments[0].gameId || arguments[0].gameId.length !== 4) {
                throw new Error('GameId is not provided or is not valid');
            }
            return originalMethod.apply(this, arguments);
        };
        return descriptor;
    }
}

