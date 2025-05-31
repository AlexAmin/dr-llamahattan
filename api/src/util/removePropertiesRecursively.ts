export function removePropertiesRecursively(obj: any, propsToRemove: string[]): void {
    if (typeof obj !== 'object' || obj === null) return;

    if (obj.properties) {
        propsToRemove.forEach(prop => delete obj.properties[prop]);
    }

    if (obj.required && Array.isArray(obj.required)) {
        obj.required = obj.required.filter((prop: string) => !propsToRemove.includes(prop));
    }

    Object.values(obj).forEach(value => removePropertiesRecursively(value, propsToRemove));
}