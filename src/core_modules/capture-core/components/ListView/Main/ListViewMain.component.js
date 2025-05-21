// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withFilters } from './withFilters';
import { ListPagination } from '../Pagination';
import { ColumnSelector } from '../ColumnSelector';
import { Actions } from '../Actions';
import { withEndColumnMenu } from '../withEndColumnMenu';
import { DialogLoadingMask } from '../../LoadingMasks/DialogLoadingMask.component';
import { OnlineList } from '../../List';
import { ListViewMenu } from '../Menu';
import type { Props } from './listViewMain.types';

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
    topBarRightContainer: {
        display: 'flex',
        gap: '6px',
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
        const {
            classes,
            filters,
            columns,
            customMenuContents,
            customTopBarActions,
            onSetColumnOrder,
            isSelectionInProgress,
            bulkActionBarComponent,
        } = this.props;

        if (isSelectionInProgress) {
            return bulkActionBarComponent;
        }

        return (
            <div
                className={classes.topBarContainer}
            >
                <div
                    className={classes.topBarLeftContainer}
                >
                    {filters}
                </div>
                <div className={classes.topBarRightContainer}>
                    <Actions customTopBarActions={customTopBarActions} />
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
        const { classes, isSelectionInProgress } = this.props;
        return (
            <div
                className={classes.paginationContainer}
            >
                <ListPagination
                    disabled={isSelectionInProgress}
                />
            </div>
        );
    }

    renderList = () => {
        const {
            classes,
            filters,
            updatingWithDialog,
            onClickListRow,
            onRowSelect,
            onSelectAll,
            customRowMenuContents,
            customTopBarActions,
            isSelectionInProgress,
            ...passOnProps
        } = this.props;

        const ListComponent = (!customRowMenuContents || !customRowMenuContents.length) ?
            OnlineList :
            ListWithEndColumnMenu;

        return (
            <ListComponent
                {...passOnProps}
                showSelectCheckBox
                isSelectionInProgress={isSelectionInProgress}
                customRowMenuContents={customRowMenuContents}
                customTopBarActions={customTopBarActions}
                onRowClick={onClickListRow}  // TODO: Fix row click naming for the online and offline list
                onRowSelect={onRowSelect}
                onSelectAll={onSelectAll}
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
