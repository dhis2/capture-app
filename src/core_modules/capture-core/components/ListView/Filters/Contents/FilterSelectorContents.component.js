// @flow
import React, { useMemo, type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { filterTypesObject } from '../filterTypes';
import { MAX_OPTIONS_COUNT_FOR_OPTION_SET_CONTENTS } from '../filters.const';
import withButtons from './withButtons';
import {
    TextFilter,
    NumericFilter,
    AssigneeFilter,
    TrueOnlyFilter,
    BooleanFilter,
    DateFilter,
    OptionSetFilter,
} from '../../../FiltersForTypes';
import type { Props } from './filterSelectorContents.types';

const getStyles = (theme: Theme) => ({
    container: {
        padding: theme.typography.pxToRem(24),
    },
});

const OptionSetFilterWithButtons = withButtons()(
    OptionSetFilter,
);

const selectorContentsForTypes = {
    // $FlowFixMe[prop-missing] automated comment
    [filterTypesObject.TEXT]: TextFilter,
    // $FlowFixMe[prop-missing] automated comment
    [filterTypesObject.NUMBER]: NumericFilter,
    // $FlowFixMe[prop-missing] automated comment
    [filterTypesObject.INTEGER]: NumericFilter,
    // $FlowFixMe[prop-missing] automated comment
    [filterTypesObject.INTEGER_POSITIVE]: NumericFilter,
    // $FlowFixMe[prop-missing] automated comment
    [filterTypesObject.INTEGER_NEGATIVE]: NumericFilter,
    // $FlowFixMe[prop-missing] automated comment
    [filterTypesObject.INTEGER_ZERO_OR_POSITIVE]: NumericFilter,
    // $FlowFixMe[prop-missing] automated comment
    [filterTypesObject.DATE]: DateFilter,
    // $FlowFixMe[prop-missing] automated comment
    [filterTypesObject.BOOLEAN]: BooleanFilter,
    // $FlowFixMe[prop-missing] automated comment
    [filterTypesObject.TRUE_ONLY]: TrueOnlyFilter,
    // $FlowFixMe[invalid-computed-prop] automated comment
    [filterTypesObject.ASSIGNEE]: AssigneeFilter,
};

const useContents = ({ filterValue, classes, type, options, multiValueFilter, ...passOnProps }) => {
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
            />
        );
    }

    return (
        <FilterContents
            {...passOnProps}
            filterValue={filterValue}
            type={type}
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
        <div className={classes.container}>
            {contents}
        </div>
    );
};

export const FilterSelectorContents: ComponentType<$Diff<Props, CssClasses>> =
    withStyles(getStyles)(FilterSelectorContentsPlain);
