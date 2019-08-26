// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { filterTypesObject } from '../filterTypes';
import { MAX_OPTIONS_COUNT_FOR_OPTION_SET_CONTENTS } from '../filterSelector.const';
import withButtons from './withButtons';
import withData from './withData';
import withRef from './withRef';
import withStyleRef from './withStyleRef';

import TextFilter from '../../../../../FiltersForTypes/Text/TextFilter.component';
import NumericFilter from '../../../../../FiltersForTypes/Numeric/NumericFilter.component';
import DateFilter from '../../../../../FiltersForTypes/Date/DateFilter.component';
import BooleanFilter from '../../../../../FiltersForTypes/Boolean/BooleanFilter.component';
import TrueOnlyFilter from '../../../../../FiltersForTypes/TrueOnly/TrueOnlyFilter.component';
import OptionSetFilter from '../../../../../FiltersForTypes/OptionSet/OptionSetFilter.component';
import { AssigneeFilter } from '../../../../../FiltersForTypes';

import OptionSet from '../../../../../../metaData/OptionSet/OptionSet';

const getStyles = (theme: Theme) => ({
    container: {
        padding: theme.typography.pxToRem(24),
    },
});

type Props = {
    type: $Values<typeof filterTypesObject>,
    optionSet: ?OptionSet,
    classes: {
        container: string,
    },
};

class FilterSelectorContents extends React.PureComponent<Props> {
    static selectorContentsForTypes = {
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

    static hasStylesHOC = [
        filterTypesObject.NUMBER,
        filterTypesObject.INTEGER,
        filterTypesObject.INTEGER_POSITIVE,
        filterTypesObject.INTEGER_NEGATIVE,
        filterTypesObject.INTEGER_ZERO_OR_POSITIVE,
        filterTypesObject.DATE,
        filterTypesObject.BOOLEAN,
        filterTypesObject.TRUE_ONLY,
        filterTypesObject.ASSIGNEE,
    ];

    static getOptionSetComponent() {
        return withButtons()(
            withData()(
                withStyleRef()(
                    OptionSetFilter,
                ),
            ),
        );
    }

    getContentsComponent() {
        const { type, optionSet } = this.props;
        // important to use PureComponent for this
        if (optionSet && optionSet.options && optionSet.options.length <= MAX_OPTIONS_COUNT_FOR_OPTION_SET_CONTENTS) {
            return FilterSelectorContents.getOptionSetComponent();
        }
        const SelectorContent = FilterSelectorContents.selectorContentsForTypes[type];
        if (FilterSelectorContents.hasStylesHOC.includes(type)) {
            return withButtons()(
                withData()(
                    withStyleRef()(
                        SelectorContent,
                    ),
                ),
            );
        }
        return withButtons()(
            withData()(
                withRef()(
                    SelectorContent,
                ),
            ),
        );
    }

    render() {
        const { classes, ...passOnProps } = this.props;
        const SelectorContent = this.getContentsComponent();

        return (
            <div
                className={classes.container}
            >
                <SelectorContent
                    {...passOnProps}
                />
            </div>
        );
    }
}

export default withStyles(getStyles)(FilterSelectorContents);
