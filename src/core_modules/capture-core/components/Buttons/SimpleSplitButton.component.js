// @flow
import * as React from 'react';
import { SplitButton, Menu, MenuItem } from '@dhis2/ui-core';

type Item = {
    key: string,
    text: string,
    onClick: ?Function,
};

type Props = {
    dropDownItems: Array<Item>,
};

const SimpleSplitButton = (props: Props) => {
    const { dropDownItems, ...passOnProps } = props;
    return (
        // $FlowFixMe[cannot-spread-inexact] automated comment
        <SplitButton
            component={SimpleSplitButton.getComponent(dropDownItems)}
            {...passOnProps}
        />
    );
};

SimpleSplitButton.getItems = (items: Array<Item>) =>
    items
        .map(i => (
            <Menu key={i.key}>
                <MenuItem label={i.text} value={i.text} onClick={i.onClick} />
            </Menu>),
        );

SimpleSplitButton.getComponent = (items: Array<Item>) => (
    <React.Fragment>
        {SimpleSplitButton.getItems(items)}
    </React.Fragment>
);
export default SimpleSplitButton;
