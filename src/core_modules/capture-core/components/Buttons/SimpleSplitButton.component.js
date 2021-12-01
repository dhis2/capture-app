// @flow
import { SplitButton, Menu, MenuItem } from '@dhis2/ui';
import * as React from 'react';
import uuid from 'uuid/v4';

type Item = {
    key: string,
    text: string,
    onClick: ?Function,
};

type Props = {
    dropDownItems: Array<Item>,
};

export const SimpleSplitButton = (props: Props) => {
    const { dropDownItems, ...passOnProps } = props;
    return (
        // $FlowFixMe[cannot-spread-inexact] automated comment
        <SplitButton
            component={
                <Menu>
                    {
                        dropDownItems.map(i => (
                            <MenuItem key={uuid()} label={i.text} value={i.text} onClick={i.onClick} />
                        ))}
                </Menu>
            }
            {...passOnProps}
        />
    );
};
