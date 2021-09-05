// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import cx from 'classnames';
import { colors, spacersNum } from '@dhis2/ui';
import moment from 'moment';

type Props = {
    notes: Array<Object>,
    ...CssClasses
}

const styles = {
    item: {
        '&:not(:first-child)': {
            marginTop: spacersNum.dp16,
        },
        padding: '12px',
        background: '#F3F5F7',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: spacersNum.dp16,
    },
    wrapper: {
        marginLeft: spacersNum.dp16,
        marginRight: spacersNum.dp16,
    },
    headerText: {
        color: colors.grey900,
        fontWeight: 500,
    },
    name: {
        fontSize: '14px',
    },
    lastUpdated: {
        fontSize: '12px',
        marginLeft: '12px',
    },
    body: {
        marginTop: '4px',
    },
    avatar: {
        width: spacersNum.dp24,
    },
    rightColumn: {
        paddingLeft: spacersNum.dp8,
    },
};

const CommentSectionPlain = ({
    notes,
    classes,
}: Props) => {
    const CommentItem = ({ value, lastUpdated, lastUpdatedBy }) => (<div className={cx(classes.item)}>
        <div className={classes.avatar} /> {/* TODO: add avatar */}
        <div className={classes.rightColumn}>
            <div className={classes.header}>
                <span className={cx(classes.headerText, classes.name)}>
                    {lastUpdatedBy.firstName} {' '} {lastUpdatedBy.surname}
                </span>
                <span className={cx(classes.headerText, classes.lastUpdated)}>
                    {moment(lastUpdated).fromNow()}
                </span>
            </div>
            <div className={classes.body}>
                {value}
            </div>
        </div>
    </div>);
    return <div className={classes.wrapper}>{notes.map(note => <CommentItem key={note.note} {...note} />)}</div>;
};

export const CommentSection: ComponentType<Props> = withStyles(styles)(CommentSectionPlain);
