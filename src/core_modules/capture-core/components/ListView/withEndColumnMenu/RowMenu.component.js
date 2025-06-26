// @flow
import React, { useState, useRef } from 'react';
import { IconButton } from 'capture-ui';
import { MenuItem, Layer, Popper, IconMore24, FlyoutMenu } from '@dhis2/ui';
import type { Props } from './rowMenu.types';
import { ConditionalTooltip } from '../../Tooltips/ConditionalTooltip';

export const RowMenu = (props: Props) => {
    const { customRowMenuContents = [], row } = props;

    const anchorRef = useRef(null);
    const [actionsIsOpen, setActionsIsOpen] = useState(false);

    const toggle = () => {
        setActionsIsOpen(prev => !prev);
    };

    const renderMenuItems = () => customRowMenuContents.map((content) => {
        const tooltipContent = typeof content.tooltipContent === 'function'
            ? content.tooltipContent(row)
            : null;

        const tooltipEnabled = typeof content.tooltipEnabled === 'function'
            ? content.tooltipEnabled(row)
            : false;

        const isDisabled = typeof content.disabled === 'function'
            ? content.disabled(row)
            : false;

        return (
            <ConditionalTooltip
                key={content.key}
                content={tooltipContent}
                enabled={!!tooltipEnabled}
            >
                <MenuItem
                    key={content.key}
                    data-test={`menu-item-${content.key}`}
                    onClick={() => {
                        const handler = content.clickHandler;
                        if (typeof handler === 'function') {
                            setActionsIsOpen(false);
                            handler(row);
                        }
                    }}
                    disabled={!content.clickHandler || !!isDisabled}
                    label={content.label}
                    icon={content.icon}
                />
            </ConditionalTooltip>
        );
    });

    return (
        <div ref={anchorRef} style={{ display: 'inline-block', position: 'relative' }}>
            <IconButton
                onClick={toggle}
                data-test="row-menu-toggle"
            >
                <IconMore24 />
            </IconButton>
            {actionsIsOpen && (
                <Layer onBackdropClick={() => setActionsIsOpen(false)} transparent>
                    <Popper
                        placement="right"
                        reference={anchorRef}
                        data-test="row-menu-popper"
                    >
                        <FlyoutMenu role="menu">
                            {renderMenuItems()}
                        </FlyoutMenu>
                    </Popper>
                </Layer>
            )}
        </div>
    );
};
