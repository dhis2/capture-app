// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { filterTypesObject } from '../filterTypes';
import { MAX_OPTIONS_COUNT_FOR_OPTION_SET_CONTENTS } from '../filterSelector.const';
import withButtons from './withButtons';
import withData from './withData';

import {
    TextFilter,
    NumericFilter,
    AssigneeFilter,
    TrueOnlyFilter,
    BooleanFilter,
    DateFilter,
    OptionSetFilter,
} from '../../../../../FiltersForTypes';

const getStyles = (theme: Theme) => ({
    container: {
        padding: theme.typography.pxToRem(24),
    },
});

type Props = {
    type: $Values<typeof filterTypesObject>,
    // $FlowFixMe[cannot-resolve-name] automated comment
    optionSet: ?OptionSet,
    classes: {
        container: string,
    },
};

class FilterSelectorContents extends React.PureComponent<Props> {
    static getOptionSetComponent() {
        return withButtons()(
            withData()(
                OptionSetFilter,
            ),
        );
    }

    static selectorContentsForTypes = {
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

    static hasStylesHOC = [
        // $FlowFixMe[prop-missing] automated comment
        filterTypesObject.NUMBER,
        // $FlowFixMe[prop-missing] automated comment
        filterTypesObject.INTEGER,
        // $FlowFixMe[prop-missing] automated comment
        filterTypesObject.INTEGER_POSITIVE,
        // $FlowFixMe[prop-missing] automated comment
        filterTypesObject.INTEGER_NEGATIVE,
        // $FlowFixMe[prop-missing] automated comment
        filterTypesObject.INTEGER_ZERO_OR_POSITIVE,
        // $FlowFixMe[prop-missing] automated comment
        filterTypesObject.DATE,
        // $FlowFixMe[prop-missing] automated comment
        filterTypesObject.BOOLEAN,
        // $FlowFixMe[prop-missing] automated comment
        filterTypesObject.TRUE_ONLY,
        filterTypesObject.ASSIGNEE,
    ];

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
                    SelectorContent,
                ),
            );
        }
        return withButtons()(
            withData()(
                SelectorContent,
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
