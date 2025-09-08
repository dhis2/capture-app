export const placements = {
    TOP: 'top',
    BOTTOM: 'bottom',
    BEFORE_METADATA_BASED_SECTION: 'before_metadata_based_section',
} as const;

export type PlacementType = typeof placements[keyof typeof placements];
