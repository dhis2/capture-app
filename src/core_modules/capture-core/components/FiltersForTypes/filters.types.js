// @flow
export interface UpdatableFilterContent<T> {
    onGetUpdateData: (updatedValue?: T) => any;
    onIsValid?: () => boolean,
}

export const assigneeFilterModes = Object.freeze({
    PROVIDED: 'PROVIDED',
    CURRENT: 'CURRENT',
    ANY: 'ANY',
    NONE: 'NONE',
});

export type AssigneeFilterData = {
    assignedUserMode: $Values<typeof assigneeFilterModes>,
    assignedUser: {
        id: string,
        username: string,
        name: string,
    },
};

export const dateFilterTypes = Object.freeze({
    ABSOLUTE: 'ABSOLUTE',
    RELATIVE: 'RELATIVE',
});

export type AbsoluteDateFilterData = {
    type: 'ABSOLUTE',
    ge?: string,
    le?: string,
};

export type RelativeDateFilterData = {
    type: 'RELATIVE',
    period: string,
};

export type DateFilterData = AbsoluteDateFilterData | RelativeDateFilterData;

export type OptionSetFilterData = {
    usingOptionSet: boolean,
    values: Array<any>,
};

export type BooleanFilterData = {
    values: Array<boolean>,
};

export type TrueOnlyFilterData = {
    value: true,
};

export type TextFilterData = {
    value: string,
};

export type NumericFilterData = {
    ge: ?number,
    le: ?number,
};
