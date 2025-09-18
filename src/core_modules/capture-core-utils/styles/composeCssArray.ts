export const composeCssArray = (classes: Record<string, unknown>, conditions: Record<string, boolean>) =>
    Object.entries(conditions).reduce((acc, [key, shouldInclude]) => {
        if (shouldInclude && classes[key]) {
            acc.push(classes[key]);
        }
        return acc;
    }, [] as any);
