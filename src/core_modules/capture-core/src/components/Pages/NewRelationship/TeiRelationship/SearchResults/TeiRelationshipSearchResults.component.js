// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { Pagination } from 'capture-ui';
import withNavigation from '../../../../Pagination/withDefaultNavigation';
import Button from '../../../../Buttons/Button.component';
import makeAttributesSelector from './teiRelationshipSearchResults.selectors';
import CardList from '../../../../CardList/CardList.component';
import LoadingMask from '../../../../LoadingMasks/LoadingMask.component';

const SearchResultsPager = withNavigation()(Pagination);

type Props = {
    resultsLoading: ?boolean,
    teis: Array<any>,
    onNewSearch: () => void,
    onEditSearch: () => void,
    paging: Object,
    onChangePage: (page: number) => void,
    onAddRelationship: (id: string, values: Object) => void,
    trackedEntityTypeName: string,
    classes: {
        itemActionsContainer: string,
        addRelationshipButton: string,
        pagination: string,
        topActionsContainer: string,
        actionButton: string,
    },
}

const getStyles = (theme: Theme) => ({
    itemActionsContainer: {
        padding: theme.typography.pxToRem(10),
    },
    pagination: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    topActionsContainer: {
        margin: theme.typography.pxToRem(10),
        backgroundColor: theme.palette.grey.lighter,
    },
    actionButton: {
        margin: theme.typography.pxToRem(10),
        color: theme.palette.primary.dark,
        borderRadius: 0,
        border: `1px solid ${theme.palette.primary.dark}`,
    },
});

class TeiRelationshipSearchResults extends React.Component<Props> {
    getAttributes: Function;
    constructor(props: Props) {
        super(props);
        this.getAttributes = makeAttributesSelector();
    }

    onAddRelationship = (item) => {
        this.props.onAddRelationship(item.id, item.values);
    }

    getItemActions = (itemProps: Object) => {
        const classes = this.props.classes;
        return (
            <div className={classes.itemActionsContainer}>
                <Button
                    color="primary"
                    onClick={() => this.onAddRelationship(itemProps.item)}
                >
                    {i18n.t('Link')}
                </Button>
            </div>
        );
    }

    renderResults = () => {
        const attributes = this.getAttributes(this.props);
        const { teis, trackedEntityTypeName } = this.props;
        return (
            <React.Fragment>
                {this.renderTopActions()}
                <CardList
                    items={teis}
                    dataElements={attributes}
                    noItemsText={i18n.t('No {{trackedEntityTypeName}} found.', { trackedEntityTypeName })}
                    getCustomItemBottomElements={itemProps => this.getItemActions(itemProps)}
                />
                {this.renderPager()}
            </React.Fragment>
        );
    }

    renderTopActions = () => {
        const { onNewSearch, onEditSearch, classes } = this.props;
        return (
            <div className={classes.topActionsContainer}>
                <Button className={classes.actionButton} onClick={onNewSearch}>
                    {i18n.t('New search')}
                </Button>
                <Button className={classes.actionButton} onClick={onEditSearch}>
                    {i18n.t('Edit search')}
                </Button>
            </div>
        );
    }

    renderPager = () => {
        const { classes, onChangePage, paging } = this.props;
        return (
            <div className={classes.pagination}>
                <SearchResultsPager
                    onChangePage={onChangePage}
                    onGetLabelDisplayedRows={(a, b) => `${a} of ${b}`}
                    {...paging}
                />
            </div>
        );
    }

    render() {
        return (
            <div>
                { this.props.resultsLoading ? <LoadingMask /> : this.renderResults() }
            </div>

        );
    }
}

export default withStyles(getStyles)(TeiRelationshipSearchResults);
