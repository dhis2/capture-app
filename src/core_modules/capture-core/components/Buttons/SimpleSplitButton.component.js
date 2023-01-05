// @flow
import * as React from 'react';
import { SplitButton, FlyoutMenu, MenuItem } from '@dhis2/ui';
import { v4 as uuid } from 'uuid';

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
                <FlyoutMenu>
                    {dropDownItems.map(i => (
                        <MenuItem key={uuid()} label={i.text} value={i.text} onClick={i.onClick} />
                    ))}
                </FlyoutMenu>
            }
            {...passOnProps}
        />
    );
};
