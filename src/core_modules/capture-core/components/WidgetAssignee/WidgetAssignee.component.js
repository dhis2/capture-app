// @flow
import React, { useState, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconUser24, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import type { PlainProps } from './WidgetAssignee.types';
import { Widget } from '../Widget';
import { DisplayMode } from './DisplayMode.component';
import { EditMode } from './EditMode.component';

const styles = () => ({
    header: {
        display: 'flex',
        alignItems: 'center',
    },
    wrapper: {
        padding: `0 ${spacers.dp16} ${spacers.dp16} ${spacers.dp16}`,
    },
});

const WidgetAssigneePlain = ({ assignee, writeAccess, onSet, avatarId, classes }: PlainProps) => {
    const [open, setOpenStatus] = useState(true);
    const [editMode, setEditMode] = useState(false);

    const handleSet = useCallback(
        (user) => {
            setEditMode(false);
            onSet(user);
        },
        [onSet],
    );

    return (
        <div data-test="widget-assignee">
            <Widget
                header={
                    <span className={classes.header}>
                        <IconUser24 /> <span>{i18n.t('Assignee')}</span>
                    </span>
                }
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
                open={open}
            >
                <div className={classes.wrapper}>
                    {editMode ? (
                        <EditMode onCancel={() => setEditMode(false)} onSet={handleSet} assignee={assignee} />
                    ) : (
                        <DisplayMode
                            assignee={assignee}
                            onEdit={() => setEditMode(true)}
                            writeAccess={writeAccess}
                            avatarId={avatarId}
                        />
                    )}
                </div>
            </Widget>
        </div>
    );
};

export const WidgetAssigneeComponent = withStyles(styles)(WidgetAssigneePlain);
