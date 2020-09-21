// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { pipe } from 'capture-core-utils';
import { withStyles } from '@material-ui/core';
import { Pagination } from 'capture-ui';
import withNavigation from '../../../../Pagination/withDefaultNavigation';
import Button from '../../../../Buttons/Button.component';
import makeAttributesSelector from './teiRelationshipSearchResults.selectors';
import { CardList } from '../../../../CardList';
import { LoadingMask } from '../../../../LoadingMasks';
import {
    convertFormToClient,
    convertClientToList,
} from '../../../../../converters';

const formToListConverterFn = pipe(
    convertFormToClient,
    convertClientToList,
);

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

    getSearchValues = () => {
        const { searchValues, searchGroup, teis, classes } = this.props;
        const searchForm = searchGroup.searchForm;
        const attributeValues = Object.keys(searchValues)
            .filter(key => searchValues[key] !== null)
            .map((key) => {
                const element = searchForm.getElement(key);
                const value = searchValues[key];
                const listValue = element.convertValue(value, formToListConverterFn);
                return (
                    <span key={key}>
                        {element.formName}: {listValue}
                    </span>
                );
            }).reduce((accValues, value) => {
                if (accValues.length > 0) return [...accValues, ', ', value];
                return [' ', value];
            }, []);

        const text = i18n.t('{{teiCount}} results found for', {
            teiCount: teis.length,
        });

        return (
            <div className={classes.topSectionValuesContainer}>
                {text}
                {attributeValues}
            </div>
        );
    }

    renderTopSection = () => {
        const { onNewSearch, onEditSearch, classes } = this.props;
        return (
            <div className={classes.topSection}>
                {this.getSearchValues()}
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
