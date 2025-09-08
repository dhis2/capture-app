import * as React from 'react';
import { SplitButton, FlyoutMenu, MenuItem, SplitButtonProps } from '@dhis2/ui';
import { v4 as uuid } from 'uuid';

interface Item {
    text: string;
    onClick?: (payload: { value: string | undefined }, event: React.MouseEvent<HTMLAnchorElement>) => void;
}

interface Props extends Omit<SplitButtonProps, 'component'> {
    dropDownItems: Item[];
}

export const SimpleSplitButton = (props: Props) => {
    const { dropDownItems, ...passOnProps } = props;
    return (
        <SplitButton
            component={
                <FlyoutMenu>
                    {dropDownItems.map(i => (
                        // @ts-expect-error - UI apparently expects a suffix here, but that does not make sense. Remove this once the issue is fixed.
                        <MenuItem
                            key={uuid()}
                            label={i.text}
                            value={i.text}
                            onClick={i.onClick}
                        />
                    ))}
                </FlyoutMenu>
            }
            {...passOnProps}
        />
    );
};
