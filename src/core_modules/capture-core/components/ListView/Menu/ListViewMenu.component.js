// @flow
import React, { useCallback, memo, type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { IconButton, Paper, MenuList, MenuItem, Divider } from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import Popper from '../../Popper/Popper.component';
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
    const renderPopperAction = useCallback((togglePopper: Function) => (
        <IconButton onClick={togglePopper}>
            <MoreHoriz />
        </IconButton>
    ), []);

    const renderMenuItems = useCallback((togglePopper: Function) =>
        customMenuContents
            .map((content) => {
                if (content.subHeader) {
                    return (
                        <>
                            <Divider
                                key={`${content.key}divider`}
                                data-test={`subheader-divider-${content.key}`}
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
                    >
                        {
                            // $FlowFixMe Using exact types, in my book this should work. Please tell me what I'm missing.
                            content.element}
                    </MenuItem>
                );
            })
            .flat(1), [customMenuContents, classes]);

    const renderPopperContent = useCallback((togglePopper: Function) => (
        <Paper>
            <MenuList role="menu">
                {renderMenuItems(togglePopper)}
            </MenuList>
        </Paper>
    ), [renderMenuItems]);

    return (
        <Popper
            getPopperAction={renderPopperAction}
            getPopperContent={renderPopperContent}
        />
    );
};

export const ListViewMenu: ComponentType<$Diff<Props, CssClasses>> =
    memo<$Diff<Props, CssClasses>>(withStyles(getStyles)(ListViewMenuPlain));
