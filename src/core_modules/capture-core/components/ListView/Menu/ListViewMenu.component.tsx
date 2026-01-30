import React, { useState, useRef, memo, useCallback } from 'react';
import { IconButton, isLangRtl } from 'capture-ui';
import { MenuItem, Layer, Popper, IconMore24, FlyoutMenu, Divider } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

import type { Props } from './listViewMenu.types';

const getStyles = () => ({
    subHeader: {
        paddingInline: 16,
        paddingBlock: 10,
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

const ListViewMenuPlain = ({ customMenuContents = [], classes }: Props & WithStyles<typeof getStyles>) => {
    const anchorRef = useRef<any | null>(null);
    const [actionsIsOpen, setActionsIsOpen] = useState(false);

    const toggle = () => {
        setActionsIsOpen(prev => !prev);
    };


    const renderMenuItems = useCallback(() =>
        customMenuContents
            .map((content) => {
                if ('subHeader' in content) {
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
                            setActionsIsOpen(false);
                            content.clickHandler();
                        }}
                        disabled={!content.clickHandler}
                        label={content.element}
                        suffix=""
                    />
                );
            })
            .flat(1), [customMenuContents, classes]);

    return (
        <div ref={anchorRef} style={{ display: 'inline-block', position: 'relative' }}>
            <IconButton
                onClick={toggle}
                dataTest="list-view-menu-button"
            >
                <IconMore24 />
            </IconButton>
            {actionsIsOpen && (
                <Layer onBackdropClick={() => setActionsIsOpen(false)}>
                    <Popper
                        placement={isLangRtl() ? 'bottom-start' : 'bottom-end'}
                        reference={anchorRef}
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

export const ListViewMenu = memo(withStyles(getStyles)(ListViewMenuPlain));
