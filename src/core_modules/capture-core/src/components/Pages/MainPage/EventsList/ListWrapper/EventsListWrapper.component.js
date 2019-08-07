// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

import elementTypes from '../../../../../metaData/DataElement/elementTypes';

import withFilterSelectors from '../FilterSelectors/withFilterSelectors';
import { ListPagination } from '../Pagination';

import DownloadTable from '../../../../DownloadTable/DownloadTable.container';
import OptionSet from '../../../../../metaData/OptionSet/OptionSet';
import withCustomEndCell from '../withCustomEndCell';
import eventContentMenuSettings from '../EventContentMenu/eventContentMenuSettings';
import DialogLoadingMask from '../../../../LoadingMasks/DialogLoadingMask.component';

import List from '../../../../List/OnlineList/List.component';
import ListWrapperMenu from '../ListWrapperMenu/ListWrapperMenu.container';

const EventList = withCustomEndCell(eventContentMenuSettings)(List);

const getStyles = (theme: Theme) => ({
    container: {
    },
    topBarContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: theme.typography.pxToRem(8),
    },
    topBarLeftContainer: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    paginationContainer: {
        fontSize: theme.typography.pxToRem(12),
        color: theme.palette.text.secondary,
        // $FlowFixMe
        fontWeight: theme.typography.fontWeightMedium,
        display: 'flex',
        justifyContent: 'flex-end',
    },
});

export type Column = {
    id: string,
    header: string,
    visible: boolean,
    type: $Values<typeof elementTypes>,
    optionSet?: ?OptionSet,
};

type Props = {
    listId: string,
    dataSource: Array<{eventId: string, [elementId: string]: any}>,
    columns: ?Array<Column>,
    classes: {
        container: string,
        topBarContainer: string,
        topBarLeftContainer: string,
        paginationContainer: string,
    },
    filterButtons: React.Node,
    isUpdatingWithDialog?: ?boolean,
};

class EventListWrapper extends React.Component<Props> {
    renderTopBar = () => {
        const { classes, filterButtons, columns, listId } = this.props;
        return (
            <div
                className={classes.topBarContainer}
            >
                <div
                    className={classes.topBarLeftContainer}
                >
                    {filterButtons}
                </div>
                <div>
                    <ListWrapperMenu
                        columns={columns}
                        listId={listId}
                    />
                </div>
            </div>
        );
    };

    renderPager = () => {
        const classes = this.props.classes;
        return (
            <div
                className={classes.paginationContainer}
            >
                <ListPagination
                    listId={this.props.listId}
                />
            </div>
        );
    };

    renderList = () => {
        const {
            classes,
            filterButtons,
            isUpdatingWithDialog,
            ...passOnProps
        } = this.props;
        return (
            <EventList
                rowIdKey={'eventId'}
                {...passOnProps}
            />
        );
    };

    render() {
        const { classes, isUpdatingWithDialog } = this.props; //eslint-disable-line

        return (
            <div
                className={classes.container}
            >
                {this.renderTopBar()}
                {this.renderList()}
                {this.renderPager()}
                {this.props.isUpdatingWithDialog && <DialogLoadingMask />}
            </div>
        );
    }
}
/**
 * Create the event list for a event capture program
 * @namespace EventsList
 */
export default withFilterSelectors()(withStyles(getStyles)(EventListWrapper));
