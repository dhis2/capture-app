// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { Pagination } from 'capture-ui';
import withNavigation from '../../../../Pagination/withDefaultNavigation';
import Button from '../../../../Buttons/Button.component';
import makeAttributesSelector from './teiRelationshipSearchResults.selectors';
import { CardList } from '../../../../CardList';
import { LoadingMask } from '../../../../LoadingMasks';
import type { CurrentSearchTerms } from '../../../Search/SearchForm/SearchForm.types';
import { SearchResultsHeader } from '../../../../SearchResultsHeader';

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
        topSection: string,
        actionButton: string,
        topSectionValuesContainer: string,
    },
    searchValues: any,
    searchGroup: any,
}

const getStyles = (theme: Theme) => ({
    itemActionsContainer: {
        paddingTop: theme.typography.pxToRem(10),
    },
    pagination: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginLeft: theme.typography.pxToRem(8),
        maxWidth: theme.typography.pxToRem(600),
    },
    topSection: {
        display: 'flex',
        flexDirection: 'column',
        margin: theme.typography.pxToRem(8),
        marginRight: 0,
        backgroundColor: theme.palette.grey.lighter,
        maxWidth: theme.typography.pxToRem(600),
    },
    topSectionValuesContainer: {
        padding: theme.typography.pxToRem(10),
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

    getItemActions = ({ item }: Object) => {
        const classes = this.props.classes;
        return (
            <div className={classes.itemActionsContainer}>
                <Button
                    dataTest={`dhis2-capture-relationship-tei-link-${item.id}`}
                    color="primary"
                    onClick={() => this.onAddRelationship(item)}
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
                {this.renderTopSection()}
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

    getSearchValues = (): CurrentSearchTerms => {
        const { searchValues, searchGroup } = this.props;
        const searchForm = searchGroup.searchForm;
        return Object.keys(searchValues)
            .filter(key => searchValues[key] !== null)
            .map((key) => {
                const element = searchForm.getElement(key);
                const value = searchValues[key];
                return { name: element.formName, value, id: element.id, type: element.type };
            });
    }

    renderTopSection = () => {
        const { onNewSearch, onEditSearch, classes } = this.props;
        return (
            <div className={classes.topSection}>
                <SearchResultsHeader currentSearchTerms={this.getSearchValues()} />
                <div>
                    <Button className={classes.actionButton} onClick={onNewSearch}>
                        {i18n.t('New search')}
                    </Button>
                    <Button className={classes.actionButton} onClick={onEditSearch}>
                        {i18n.t('Edit search')}
                    </Button>
                </div>

            </div>
        );
    }

    renderPager = () => {
        const { onChangePage, paging, classes } = this.props;
        return (
            <div className={classes.pagination}>
                <SearchResultsPager
                    onChangePage={onChangePage}
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
