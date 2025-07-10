export const TARGET_SIDES = {
    FROM: 'FROM',
    TO: 'TO',
} as const;

export type TargetSides = typeof TARGET_SIDES[keyof typeof TARGET_SIDES];
