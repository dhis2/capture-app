// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { filterTypesObject } from '../filterTypes';
import withData from './withData';
import withRef from './withRef';
import withButtons from './withButtons';

import TextFilter from '../../../../../FiltersForTypes/TextFilter.component';

const getStyles = (theme: Theme) => ({
    container: {
        padding: theme.typography.pxToRem(24),
    }
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
    };

    getContentsComponent() {
        const { type } = this.props;
        // important to use PureComponent for this
        const SelectorContent = FilterSelectorContents.selectorContentsForTypes[type];
        return withButtons()(
            withData()(
                withRef()(
                    SelectorContent,
                ),
            ),
        );
    }

    render() {
        const { type, classes, ...passOnProps } = this.props;
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
