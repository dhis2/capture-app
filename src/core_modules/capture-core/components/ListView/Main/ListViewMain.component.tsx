import * as React from 'react';
import { spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { withFilters } from './withFilters';
import { ListPagination } from '../Pagination';
import { ColumnSelector } from '../ColumnSelector';
import { Actions } from '../Actions';
import { withEndColumnMenu } from '../withEndColumnMenu';
import { DialogLoadingMask } from '../../LoadingMasks/DialogLoadingMask.component';
import { OnlineList } from '../../List';
import { ListViewMenu } from '../Menu';
import type { Props } from './listViewMain.types';
import './listViewMain.css';

const ListWithEndColumnMenu = withEndColumnMenu()(OnlineList);

const getStyles: Readonly<any> = (theme: any) => ({
    topBarContainer: {
        display: 'flex',
        padding: spacers.dp8,
        gap: spacers.dp16,
    },
    topBarLeftContainer: {
        flexGrow: 1,
        flexShrink: 1,
    },
    topBarRightContainer: {
        flexGrow: 1,
        flexShrink: 1,
        justifyContent: 'flex-end',
        display: 'flex',
        paddingTop: spacers.dp8,
        paddingBottom: spacers.dp8,
        gap: spacers.dp4,
    },
    paginationContainer: {
        fontSize: theme.typography.pxToRem(12),
        color: theme.palette.text.secondary,
        fontWeight: theme.typography.fontWeightMedium,
        display: 'flex',
        justifyContent: 'flex-end',
    },
});

class ListViewMainPlain extends React.PureComponent<Props & WithStyles<typeof getStyles>> {
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
                id="top-bar-container-list-view-main"
                className={classes.topBarContainer}
            >
                <div
                    className={classes.topBarLeftContainer}
                >
                    {filters}
                </div>
                <div
                    id="top-bar-right-column-list-view-main"
                    className={classes.topBarRightContainer}
                >
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
                onRowClick={onClickListRow}
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
