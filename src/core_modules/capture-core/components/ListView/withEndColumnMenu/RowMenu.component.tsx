import React, { useState, useRef } from 'react';
import { IconButton } from 'capture-ui';
import { MenuItem, Layer, Popper, IconMore24, FlyoutMenu } from '@dhis2/ui';
import type { Props } from './rowMenu.types';

export const RowMenu = (props: Props) => {
    const { customRowMenuContents = [], row } = props;

    const anchorRef = useRef<HTMLDivElement>(null);
    const [actionsIsOpen, setActionsIsOpen] = useState(false);

    const toggle = () => {
        setActionsIsOpen(prev => !prev);
    };

    const renderMenuItems = () => customRowMenuContents.map(content => (
        <MenuItem
            key={content.key}
            data-test={`menu-item-${content.key}`}
            onClick={() => {
                if (!content.clickHandler) {
                    return;
                }
                setActionsIsOpen(false);
                content.clickHandler(row);
            }}
            disabled={!content.clickHandler}
            label={content.label}
            icon={content.icon}
            suffix={null}
        />
    ));

    return (
        <div ref={anchorRef} style={{ display: 'inline-block', position: 'relative' }}>
            <IconButton
                onClick={toggle}
                data-test="row-menu-toggle"
            >
                <IconMore24 />
            </IconButton>
            {actionsIsOpen && (
                <Layer onBackdropClick={() => setActionsIsOpen(false)}>
                    <Popper
                        placement="right"
                        // @ts-expect-error - keeping original functionality as before ts rewrite
                        reference={anchorRef}
                        data-test="row-menu-popper"
                    >
                        <FlyoutMenu>
                            {renderMenuItems()}
                        </FlyoutMenu>
                    </Popper>
                </Layer>
            )}
        </div>
    );
};
