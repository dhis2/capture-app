import React, { useMemo, useState } from 'react';
import { withStyles, WithStyles } from 'capture-core-utils/styles';
import { useFeature, FEATURES } from 'capture-core-utils/featuresSupport';
import { MAX_OPTIONS_COUNT_FOR_OPTION_SET_CONTENTS, filterTypesObject } from '../filters.const';
import { withButtons } from './withButtons';
import {
    TextFilter,
    NumericFilter,
    AssigneeFilter,
    TrueOnlyFilter,
    BooleanFilter,
    DateFilter,
    DateTimeFilter,
    AgeFilter,
    OptionSetFilter,
    EmptyOnlyFilter,
    OrgUnitFilter,
    UsernameFilter,
} from '../../../FiltersForTypes';
import type { Props } from './filterSelectorContents.types';

const getStyles = (theme: any) => ({
    container: {
        padding: theme.typography.pxToRem(24),
    },
});

const OptionSetFilterWithButtons = withButtons()(
    OptionSetFilter,
);

const selectorContentsForTypes = {
    [filterTypesObject.AGE]: AgeFilter,
    [filterTypesObject.ASSIGNEE]: AssigneeFilter,
    [filterTypesObject.BOOLEAN]: BooleanFilter,
    [filterTypesObject.COORDINATE]: EmptyOnlyFilter,
    [filterTypesObject.DATE]: DateFilter,
    [filterTypesObject.DATETIME]: DateTimeFilter,
    [filterTypesObject.EMAIL]: TextFilter,
    [filterTypesObject.FILE_RESOURCE]: EmptyOnlyFilter,
    [filterTypesObject.IMAGE]: EmptyOnlyFilter,
    [filterTypesObject.INTEGER]: NumericFilter,
    [filterTypesObject.INTEGER_NEGATIVE]: NumericFilter,
    [filterTypesObject.INTEGER_POSITIVE]: NumericFilter,
    [filterTypesObject.INTEGER_ZERO_OR_POSITIVE]: NumericFilter,
    [filterTypesObject.LONG_TEXT]: TextFilter,
    [filterTypesObject.NUMBER]: NumericFilter,
    [filterTypesObject.ORGANISATION_UNIT]: OrgUnitFilter,
    [filterTypesObject.PERCENTAGE]: TextFilter,
    [filterTypesObject.PHONE_NUMBER]: TextFilter,
    [filterTypesObject.TEXT]: TextFilter,
    [filterTypesObject.TIME]: TextFilter,
    [filterTypesObject.TRUE_ONLY]: TrueOnlyFilter,
    [filterTypesObject.URL]: TextFilter,
    [filterTypesObject.USERNAME]: UsernameFilter,
};

const EMPTY_ONLY_FILTER_TYPES = new Set([
    filterTypesObject.COORDINATE,
    filterTypesObject.FILE_RESOURCE,
    filterTypesObject.IMAGE,
]);

const useContents = ({
    filterValue,
    classes,
    type,
    options,
    multiValueFilter,
    isRemovable,
    emptyValueFilterSupported,
    ...passOnProps
}) => {
    const [disabledUpdate, setUpdateDisabled] = useState(true);
    const [FilterContents, ofTypeOptionSet] = useMemo(() => {
        if (options && options.length <= MAX_OPTIONS_COUNT_FOR_OPTION_SET_CONTENTS) {
            return [OptionSetFilterWithButtons, true];
        }

        const TypeFilter = selectorContentsForTypes[type];
        return [withButtons()(TypeFilter), false];
    }, [type, options]);

    if (EMPTY_ONLY_FILTER_TYPES.has(type) && !emptyValueFilterSupported) {
        return null;
    }

    if (ofTypeOptionSet) {
        return (
            <FilterContents
                {...passOnProps}
                filter={filterValue}
                options={options}
                singleSelect={!multiValueFilter}
                handleCommitValue={() => setUpdateDisabled(false)}
                disabledUpdate={disabledUpdate}
                disabledReset={filterValue === undefined}
                isRemovable={isRemovable}
            />
        );
    }

    return (
        <FilterContents
            {...passOnProps}
            filter={filterValue}
            type={type}
            singleSelect={!multiValueFilter}
            handleCommitValue={() => setUpdateDisabled(false)}
            disabledUpdate={disabledUpdate}
            disabledReset={filterValue === undefined}
        />
    );
};

const FilterSelectorContentsPlain = ({
    classes,
    filterValue,
    type,
    options,
    multiValueFilter,
    isRemovable,
    ...passOnProps
}: Props & WithStyles<typeof getStyles>) => {
    const emptyValueFilterSupported = useFeature(FEATURES.emptyValueFilter);
    const contents = useContents({
        classes,
        filterValue,
        type,
        options,
        multiValueFilter,
        isRemovable,
        emptyValueFilterSupported,
        ...passOnProps,
    });

    if (contents === null) {
        return null;
    }

    return (
        <div className={classes.container} data-test="list-view-filter-contents">
            {contents}
        </div>
    );
};

export const FilterSelectorContents: any =
    withStyles(getStyles)(FilterSelectorContentsPlain);
