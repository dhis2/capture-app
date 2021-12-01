// @flow
import { withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { OnlineList } from '../../List';
import { DialogLoadingMask } from '../../LoadingMasks/DialogLoadingMask.component';
import { ColumnSelector } from '../ColumnSelector';
import { ListViewMenu } from '../Menu';
import { ListPagination } from '../Pagination';
import { withEndColumnMenu } from '../withEndColumnMenu';
import type { Props } from './listViewMain.types';
import { withFilters } from './withFilters';

const ListWithEndColumnMenu = withEndColumnMenu()(OnlineList);

const getStyles = (theme: Theme) => ({
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
    topBarButtonContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    paginationContainer: {
        fontSize: theme.typography.pxToRem(12),
        color: theme.palette.text.secondary,
        fontWeight: theme.typography.fontWeightMedium,
        display: 'flex',
        justifyContent: 'flex-end',
    },
});

class ListViewMainPlain extends React.PureComponent<Props> {
    renderTopBar = () => {
        const { classes, filters, columns, customMenuContents, onSetColumnOrder } = this.props;
        return (
            <div
                className={classes.topBarContainer}
            >
                <div
                    className={classes.topBarLeftContainer}
                >
                    {filters}
                </div>
                <div
                    className={classes.topBarButtonContainer}
                >
                    <ColumnSelector
                        onSave={onSetColumnOrder}
                        columns={columns}
                    />
                    <ListViewMenu
                        customMenuContents={customMenuContents}
                    />
                </div>
            </div>
        );
    }

    renderPager = () => {
        const classes = this.props.classes;
        return (
            <div
                className={classes.paginationContainer}
            >
                <ListPagination />
            </div>
        );
    }

    renderList = () => {
        const {
            classes,
            filters,
            updatingWithDialog,
            onSelectRow,
            customRowMenuContents,
            ...passOnProps
        } = this.props;

        const ListComponent = (!customRowMenuContents || !customRowMenuContents.length) ?
            OnlineList :
            ListWithEndColumnMenu;

        return (
            <ListComponent
                {...passOnProps}
                customRowMenuContents={customRowMenuContents}
                onRowClick={onSelectRow}  // TODO: Fix row click naming for the online and offline list
            />
        );
    }

    render() {
        return (
            <div>
                {this.renderTopBar()}
                {this.renderList()}
                {this.renderPager()}
                {this.props.updatingWithDialog && <DialogLoadingMask />}
            </div>
        );
    }
}

export const ListViewMain = withFilters()(withStyles(getStyles)(ListViewMainPlain));
