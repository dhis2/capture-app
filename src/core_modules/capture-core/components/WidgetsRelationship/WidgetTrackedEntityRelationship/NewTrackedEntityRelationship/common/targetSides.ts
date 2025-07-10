export const TARGET_SIDES: {
    FROM: 'FROM';
    TO: 'TO';
} = Object.freeze({
    FROM: 'FROM',
    TO: 'TO',
});

export type TargetSides = typeof TARGET_SIDES[keyof typeof TARGET_SIDES];
