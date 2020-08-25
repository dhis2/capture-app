// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { selectorTypesObject } from '../selectorTypes';
import { MAX_OPTIONS_COUNT_FOR_OPTION_SET_CONTENTS } from './contents.const';
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
} from '../../../../FiltersForTypes';

const getStyles = (theme: Theme) => ({
    container: {
        padding: theme.typography.pxToRem(24),
    },
});

type Props = {
    type: $Values<typeof selectorTypesObject>,
    // $FlowFixMe[cannot-resolve-name] automated comment
    optionSet: ?OptionSet,
    classes: {
        container: string,
    },
};

class SelectorContents extends React.PureComponent<Props> {
    static getOptionSetComponent() {
        return withButtons()(
            withData()(
                OptionSetFilter,
            ),
        );
    }

    static selectorContentsForTypes = {
        // $FlowFixMe[prop-missing] automated comment
        [selectorTypesObject.TEXT]: TextFilter,
        // $FlowFixMe[prop-missing] automated comment
        [selectorTypesObject.NUMBER]: NumericFilter,
        // $FlowFixMe[prop-missing] automated comment
        [selectorTypesObject.INTEGER]: NumericFilter,
        // $FlowFixMe[prop-missing] automated comment
        [selectorTypesObject.INTEGER_POSITIVE]: NumericFilter,
        // $FlowFixMe[prop-missing] automated comment
        [selectorTypesObject.INTEGER_NEGATIVE]: NumericFilter,
        // $FlowFixMe[prop-missing] automated comment
        [selectorTypesObject.INTEGER_ZERO_OR_POSITIVE]: NumericFilter,
        // $FlowFixMe[prop-missing] automated comment
        [selectorTypesObject.DATE]: DateFilter,
        // $FlowFixMe[prop-missing] automated comment
        [selectorTypesObject.BOOLEAN]: BooleanFilter,
        // $FlowFixMe[prop-missing] automated comment
        [selectorTypesObject.TRUE_ONLY]: TrueOnlyFilter,
        // $FlowFixMe[invalid-computed-prop] automated comment
        [selectorTypesObject.ASSIGNEE]: AssigneeFilter,
    };

    static hasStylesHOC = [
        // $FlowFixMe[prop-missing] automated comment
        selectorTypesObject.NUMBER,
        // $FlowFixMe[prop-missing] automated comment
        selectorTypesObject.INTEGER,
        // $FlowFixMe[prop-missing] automated comment
        selectorTypesObject.INTEGER_POSITIVE,
        // $FlowFixMe[prop-missing] automated comment
        selectorTypesObject.INTEGER_NEGATIVE,
        // $FlowFixMe[prop-missing] automated comment
        selectorTypesObject.INTEGER_ZERO_OR_POSITIVE,
        // $FlowFixMe[prop-missing] automated comment
        selectorTypesObject.DATE,
        // $FlowFixMe[prop-missing] automated comment
        selectorTypesObject.BOOLEAN,
        // $FlowFixMe[prop-missing] automated comment
        selectorTypesObject.TRUE_ONLY,
        selectorTypesObject.ASSIGNEE,
    ];

    getContentsComponent() {
        const { type, optionSet } = this.props;
        // important to use PureComponent for this
        if (optionSet && optionSet.options && optionSet.options.length <= MAX_OPTIONS_COUNT_FOR_OPTION_SET_CONTENTS) {
            return SelectorContents.getOptionSetComponent();
        }
        const SelectorContent = SelectorContents.selectorContentsForTypes[type];
        if (SelectorContents.hasStylesHOC.includes(type)) {
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

export default withStyles(getStyles)(SelectorContents);
