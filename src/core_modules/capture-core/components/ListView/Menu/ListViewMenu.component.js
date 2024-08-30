// @flow
import React, { useState, useRef, memo, useCallback, type ComponentType } from 'react';
import { IconButton } from 'capture-ui';
import { MenuItem, Layer, Popper, IconMore24, FlyoutMenu, Divider } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';

import type { Props } from './listViewMenu.types';

const getStyles = () => ({
    subHeader: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 10,
        paddingBottom: 10,
        color: '#717c8b',
        fontWeight: 500,
        fontSize: 16,
        '&:focus': {
            outline: 'none',
            color: 'black',
        },
    },
    subHeaderDivider: {
        '&:focus': {
            outline: 'none',
            backgroundColor: 'black',
        },
    },
});

const ListViewMenuPlain = ({ customMenuContents = [], classes }: Props) => {
    const anchorRef = useRef(null);
    const [actionsIsOpen, setActionsIsOpen] = useState(false);

    const toggle = () => {
        setActionsIsOpen(prev => !prev);
    };


    const renderMenuItems = useCallback((togglePopper: Function) =>
        customMenuContents
            .map((content) => {
                if (content.subHeader) {
                    return (
                        <>
                            <Divider
                                key={`${content.key}divider`}
                                dataTest={`subheader-divider-${content.key}`}
                                className={classes.subHeaderDivider}
                            />,
                            <div
                                key={content.key}
                                data-test={`subheader-${content.key}`}
                                className={classes.subHeader}
                            >
                                {content.subHeader}
                            </div>,
                        </>
                    );
                }

                return (
                    <MenuItem
                        key={content.key}
                        data-test={`menu-item-${content.key}`}
                        onClick={() => {
                            if (!content.clickHandler) {
                                return;
                            }
                            togglePopper();
                            // $FlowFixMe Using exact types, in my book this should work. Please tell me what I'm missing.
                            content.clickHandler();
                        }}
                        // $FlowFixMe Using exact types, in my book this should work. Please tell me what I'm missing.
                        disabled={!content.clickHandler}
                        // $FlowFixMe Using exact types, in my book this should work. Please tell me what I'm missing.
                        label={content.element}
                    />
                );
            })
            .flat(1), [customMenuContents, classes]);

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
                        placement="bottom-end"
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

export const ListViewMenu: ComponentType<$Diff<Props, CssClasses>> =
    memo < $Diff<Props, CssClasses>>(withStyles(getStyles)(ListViewMenuPlain));
