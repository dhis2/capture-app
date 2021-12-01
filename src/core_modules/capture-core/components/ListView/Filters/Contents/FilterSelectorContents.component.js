// @flow
import { withStyles } from '@material-ui/core/styles';
import React, { useMemo, useState, type ComponentType } from 'react';
import {
    TextFilter,
    NumericFilter,
    AssigneeFilter,
    TrueOnlyFilter,
    BooleanFilter,
    DateFilter,
    OptionSetFilter,
} from '../../../FiltersForTypes';
import { MAX_OPTIONS_COUNT_FOR_OPTION_SET_CONTENTS, filterTypesObject } from '../filters.const';
import type { Props } from './filterSelectorContents.types';
import { withButtons } from './withButtons';

const getStyles = (theme: Theme) => ({
    container: {
        padding: theme.typography.pxToRem(24),
    },
});

const OptionSetFilterWithButtons = withButtons()(
    OptionSetFilter,
);

const selectorContentsForTypes = {
    [filterTypesObject.TEXT]: TextFilter,
    [filterTypesObject.NUMBER]: NumericFilter,
    [filterTypesObject.INTEGER]: NumericFilter,
    [filterTypesObject.INTEGER_POSITIVE]: NumericFilter,
    [filterTypesObject.INTEGER_NEGATIVE]: NumericFilter,
    [filterTypesObject.INTEGER_ZERO_OR_POSITIVE]: NumericFilter,
    [filterTypesObject.DATE]: DateFilter,
    [filterTypesObject.BOOLEAN]: BooleanFilter,
    [filterTypesObject.TRUE_ONLY]: TrueOnlyFilter,
    [filterTypesObject.ASSIGNEE]: AssigneeFilter,
};

const useContents = ({ filterValue, classes, type, options, multiValueFilter, ...passOnProps }) => {
    const [disabledUpdate, setUpdateDisabled] = useState(true);
    const [FilterContents, ofTypeOptionSet] = useMemo(() => {
        if (options && options.length <= MAX_OPTIONS_COUNT_FOR_OPTION_SET_CONTENTS) {
            return [OptionSetFilterWithButtons, true];
        }

        const TypeFilter = selectorContentsForTypes[type];
        return [withButtons()(TypeFilter), false];
    }, [type, options]);

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
            />
        );
    }

    return (
        <FilterContents
            {...passOnProps}
            filter={filterValue}
            type={type}
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
    ...passOnProps
}: Props) => {
    const contents = useContents({ classes, filterValue, type, options, multiValueFilter, ...passOnProps });
    return (
        <div className={classes.container} data-test="list-view-filter-contents">
            {contents}
        </div>
    );
};

export const FilterSelectorContents: ComponentType<$Diff<Props, CssClasses>> =
    withStyles(getStyles)(FilterSelectorContentsPlain);
