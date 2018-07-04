// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { filterTypesObject } from '../filterTypes';
import withButtons from './withButtons';
import withData from './withData';
import withRef from './withRef';
import withStyleRef from './withStyleRef';

import TextFilter from '../../../../../FiltersForTypes/Text/TextFilter.component';
import NumericFilter from '../../../../../FiltersForTypes/Numeric/NumericFilter.component';

const getStyles = (theme: Theme) => ({
    container: {
        padding: theme.typography.pxToRem(24),
    },
});

type Props = {
    type: $Values<typeof filterTypesObject>,
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
    };

    static hasStylesHOC = [
        filterTypesObject.NUMBER,
        filterTypesObject.INTEGER,
        filterTypesObject.INTEGER_POSITIVE,
        filterTypesObject.INTEGER_NEGATIVE,
        filterTypesObject.INTEGER_ZERO_OR_POSITIVE,
    ];

    getContentsComponent() {
        const { type } = this.props;
        // important to use PureComponent for this
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
