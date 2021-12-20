// @flow

export const processProgramTrackedEntityAttributes = (programAPI: any) =>
    programAPI?.programTrackedEntityAttributes?.reduce(
        (acc, currentValue) => ({
            ...acc,
            [currentValue.trackedEntityAttribute.id]: currentValue.trackedEntityAttribute,
        }),
        {},
    );

export const processOptionSets = (trackedEntityAttributes: any) =>
    Object.values(trackedEntityAttributes)?.reduce(
        (acc, currentValue) =>
            // $FlowFixMe[incompatible-type]
            (currentValue.optionSet ? { ...acc, [currentValue.optionSet.id]: currentValue.optionSet } : acc),
        {},
    );

export const processFormValues = (trackedEntityInstanceAttributes: any) =>
    trackedEntityInstanceAttributes?.reduce((acc, currentValue) => ({ ...acc, [currentValue.attribute]: currentValue.value }), {});
