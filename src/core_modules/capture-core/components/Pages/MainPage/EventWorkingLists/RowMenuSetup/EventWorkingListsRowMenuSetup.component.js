// @flow
import React, { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import Delete from '@material-ui/icons/Delete';
import { WorkingListsCommonRedux } from '../../WorkingListsCommonRedux';
import type { RowMenuContents } from '../../WorkingLists';

const getStyles = (theme: Theme) => ({
    deleteIcon: {
        fill: theme.palette.error.main,
    },
});

type Props = {
    onDeleteEvent: Function,
    classes: Object,
};

export const Index = (props: Props) => {
    const { onDeleteEvent, classes, ...passOnProps } = props;
    const customRowMenuContents: RowMenuContents = useMemo(() => [{
        key: 'deleteEventItem',
        clickHandler: rowData => onDeleteEvent(rowData.eventId),
        element: (
            <React.Fragment>
                <Delete className={classes.deleteIcon} />
                {i18n.t('Delete event')}
            </React.Fragment>
        ),
    }], [onDeleteEvent, classes.deleteIcon]);

    return (
        <WorkingListsCommonRedux
            {...passOnProps}
            customRowMenuContents={customRowMenuContents}
        />
    );
};
Index.displayName = 'EventWorkingListsRowMenuSetup';

export const EventWorkingListsRowMenuSetup = withStyles(getStyles)(Index);
