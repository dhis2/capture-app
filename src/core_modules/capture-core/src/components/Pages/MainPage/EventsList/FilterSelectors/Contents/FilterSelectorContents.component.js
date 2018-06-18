// @flow
import React from 'react';
import { filterTypesObject } from '../filterTypes';
import withData from './withData';
import withRef from './withRef';
import withButtons from './withButtons';

import TextFilter from '../../../../../FiltersForTypes/TextFilter.component';

type Props = {
    type: $Values<typeof filterTypesObject>,
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
        const { type, ...passOnProps } = this.props;
        const SelectorContent = this.getContentsComponent();

        return (
            <SelectorContent
                {...passOnProps}
            />
        );
    }
}

export default FilterSelectorContents;
