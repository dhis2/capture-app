// @flow
import * as React from 'react';
import { SplitButton, Menu, MenuItem  } from '@dhis2/ui-core';

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
    return(
        <SplitButton
            component={SimpleSplitButton.getItems(dropDownItems)}
            {...passOnProps}
        />
    );
}

SimpleSplitButton.getItems = (items: Array<Item>) =>
items.map(i => (<Menu><MenuItem label={i.text} value={i.text} onClick={i.onClick} key={i.key}></MenuItem></Menu>));

export default SimpleSplitButton;
