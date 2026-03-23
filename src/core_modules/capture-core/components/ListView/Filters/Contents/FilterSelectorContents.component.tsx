import React, { useMemo, useState } from 'react';
import { withStyles, WithStyles } from 'capture-core-utils/styles';
import { useFeature, FEATURES } from 'capture-core-utils/featuresSupport';
import { MAX_OPTIONS_COUNT_FOR_OPTION_SET_CONTENTS, filterTypesObject, EMPTY_ONLY_FILTER_TYPES } from '../filters.const';
import { withButtons } from './withButtons';
import { withMinCharsToSearchValidation } from './withMinCharsToSearchValidation';
import {
    TextFilter,
    NumericFilter,
    AssigneeFilter,
    TrueOnlyFilter,
    BooleanFilter,
    DateFilter,
    DateTimeFilter,
    TimeFilter,
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
    [filterTypesObject.AGE]: DateFilter,
    [filterTypesObject.ASSIGNEE]: AssigneeFilter,
    [filterTypesObject.BOOLEAN]: BooleanFilter,
    [filterTypesObject.COORDINATE]: EmptyOnlyFilter,
    [filterTypesObject.DATE]: DateFilter,
    [filterTypesObject.DATETIME]: DateTimeFilter,
    [filterTypesObject.TIME]: TimeFilter,
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
    [filterTypesObject.PERCENTAGE]: NumericFilter,
    [filterTypesObject.PHONE_NUMBER]: TextFilter,
    [filterTypesObject.TEXT]: TextFilter,
    [filterTypesObject.TRUE_ONLY]: TrueOnlyFilter,
    [filterTypesObject.URL]: EmptyOnlyFilter,
    [filterTypesObject.USERNAME]: UsernameFilter,
};

const useContents = ({
    filterValue,
    classes,
    type,
    options,
    multiValueFilter,
    isRemovable,
    emptyValueFilterSupported,
    transformRecordsFilter,
    isMainProperty,
    ...passOnProps
}: Record<string, any>) => {
    // main/system filters always have transformRecordsFilter (filtersOnly) or isMainProperty (columns)
    const disableEmptyValueFilter = Boolean(transformRecordsFilter) || Boolean(isMainProperty);
    const [disabledUpdate, setUpdateDisabled] = useState(true);
    const [FilterContents, ofTypeOptionSet] = useMemo(() => {
        if (options && options.length <= MAX_OPTIONS_COUNT_FOR_OPTION_SET_CONTENTS) {
            return [OptionSetFilterWithButtons, true];
        }

        const TypeFilter = selectorContentsForTypes[type];
        return [withButtons()(withMinCharsToSearchValidation()(TypeFilter)), false];
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
                disableEmptyValueFilter={disableEmptyValueFilter}
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
            disableEmptyValueFilter={disableEmptyValueFilter}
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
    const contents =
        useContents({
            classes,
            emptyValueFilterSupported,
            filterValue,
            type,
            options,
            multiValueFilter,
            isRemovable,
            ...passOnProps,
        });

    return (
        <div className={classes.container} data-test="list-view-filter-contents">
            {contents}
        </div>
    );
};

export const FilterSelectorContents: any =
    withStyles(getStyles)(FilterSelectorContentsPlain);
