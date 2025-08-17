export const orientations = {
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical',
} as const;

export type Orientation = typeof orientations[keyof typeof orientations];
