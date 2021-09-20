// @flow
import React, { type ComponentType } from 'react';
import { IconMessages16 } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';

type Props = {|
    event: ApiEnrollmentEvent,
    ...CssClasses,
|};

const styles = {
    wrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    text: {
        paddingLeft: '2px',
    },
};
export const CommentsPlain = ({ event, classes }: Props) => {
    const commentsCount = event.notes?.length;

    return (
        commentsCount ? <div className={classes.wrapper}>
            <IconMessages16 />
            <span className={classes.text}>{commentsCount}</span>
        </div> : null
    );
};

export const Comments: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(CommentsPlain);
