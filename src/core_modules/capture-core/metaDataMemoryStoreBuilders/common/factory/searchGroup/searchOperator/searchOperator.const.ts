export const searchOperators = {
    LIKE: 'LIKE',
    SW: 'SW',
    EW: 'EW',
    EQ: 'EQ',
    RANGE: 'RANGE',
    GE: 'GE',
    LE: 'LE',
    NULL: 'NULL',
    NOT_NULL: '!NULL',
} as const;

export const DEFAULT_IS_UNIQUE_SEARCH_OPERATOR = searchOperators.EQ;
export const DEFAULT_HAS_OPTION_SET_SEARCH_OPERATOR = searchOperators.EQ;
export const DEFAULT_FALLBACK_SEARCH_OPERATOR = searchOperators.EQ;

export type SearchOperator = (typeof searchOperators)[keyof typeof searchOperators];
