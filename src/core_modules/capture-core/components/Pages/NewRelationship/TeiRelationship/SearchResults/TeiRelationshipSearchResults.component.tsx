import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from '@material-ui/core';
import { Pagination } from 'capture-ui';
import { Button } from '@dhis2/ui';
import { convertFormToClient } from 'capture-core/converters';
import { withNavigation } from '../../../../Pagination/withDefaultNavigation';
import { makeAttributesSelector } from './teiRelationshipSearchResults.selectors';
import { CardList } from '../../../../CardList';
import type { CurrentSearchTerms } from '../../../../SearchBox';
import { SearchResultsHeader } from '../../../../SearchResultsHeader';
import {
    type SearchGroup,
    getTrackerProgramThrowIfNotFound,
    getTrackedEntityTypeThrowIfNotFound,
} from '../../../../../metaData';
import { ResultsPageSizeContext } from '../../../shared-contexts';
import type { ListItem } from '../../../../CardList/CardList.types';
import { convertClientValuesToServer } from '../../../../../converters/helpers/clientToServer';

const SearchResultsPager = withNavigation()(Pagination);

type OwnProps = {
    onAddRelationship: (id: string, values: any) => void;
    onChangePage: (page: number) => void;
    onEditSearch: () => void;
    onNewSearch: () => void;
    currentPage: number;
    searchGroup: SearchGroup;
    searchValues: any;
    selectedProgramId?: string;
    selectedTrackedEntityTypeId: string;
    teis: Array<ListItem>;
    trackedEntityTypeName: string;
};

type Props = OwnProps & WithStyles<typeof getStyles>;

const getStyles = (theme: any) => ({
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
        backgroundColor: theme.palette.grey[500],
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
}) as const;

const getLinkedEntityFormFoundation = (selectedProgramId?: string, selectedTrackedEntityTypeId?: string) => {
    if (selectedProgramId) {
        const program = getTrackerProgramThrowIfNotFound(selectedProgramId);
        return program.enrollment.enrollmentForm;
    }
    if (selectedTrackedEntityTypeId) {
        const trackedEntityType = getTrackedEntityTypeThrowIfNotFound(selectedTrackedEntityTypeId);
        return trackedEntityType.teiRegistration.form;
    }
    return null;
};

type CardListButtonProps = {
    handleOnClick: () => void;
    teiId: string;
};

const CardListButton = ({ handleOnClick, teiId }: CardListButtonProps) => (
    <Button
        small
        dataTest={`relationship-tei-link-${teiId}`}
        onClick={handleOnClick}
    >
        {i18n.t('Link')}
    </Button>
);

class TeiRelationshipSearchResultsPlain extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        this.getAttributes = makeAttributesSelector();
    }

    onAddRelationship = (item: ListItem) => {
        const linkedEntityFormFoundation = getLinkedEntityFormFoundation(
            this.props.selectedProgramId,
            this.props.selectedTrackedEntityTypeId,
        );
        if (linkedEntityFormFoundation) {
            const serverValues = convertClientValuesToServer(item.values, linkedEntityFormFoundation);
            this.props.onAddRelationship(item.id, serverValues);
        } else {
            this.props.onAddRelationship(item.id, item.values);
        }
    }

    getAttributes: any;

    getSearchValues = (): CurrentSearchTerms => {
        const { searchValues, searchGroup } = this.props;
        const searchForm = searchGroup.searchForm;
        return Object.keys(searchValues)
            .filter(key => searchValues[key] !== null)
            .map((key) => {
                const element = searchForm.getElement(key);
                const value = convertFormToClient(searchValues[key], element.type);
                return { name: element.formName, value, id: element.id, type: element.type };
            });
    }

    renderResults = () => {
        const attributes = this.getAttributes(this.props);
        const { teis, trackedEntityTypeName, selectedProgramId } = this.props;

        return (
            <React.Fragment>
                {this.renderTopSection()}
                <CardList
                    currentProgramId={selectedProgramId}
                    items={teis}
                    dataElements={attributes}
                    noItemsText={i18n.t('No {{trackedEntityTypeName}} found.', {
                        trackedEntityTypeName, interpolation: { escapeValue: false },
                    })}
                    renderCustomCardActions={({ item }: any) =>
                        <CardListButton teiId={item.id} handleOnClick={() => this.onAddRelationship(item)} />
                    }
                />
                {this.renderPager()}
            </React.Fragment>
        );
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
        const { onChangePage, currentPage, classes, teis } = this.props;
        return (
            <ResultsPageSizeContext.Consumer>
                {
                    ({ resultsPageSize }: any) => (
                        <div className={classes.pagination}>
                            <SearchResultsPager
                                nextPageButtonDisabled={teis.length < resultsPageSize}
                                onChangePage={(page: number) => onChangePage(page)}
                                currentPage={currentPage}
                            />
                        </div>)
                }
            </ResultsPageSizeContext.Consumer>
        );
    }

    render() {
        return (
            <div>
                {this.renderResults()}
            </div>
        );
    }
}

export const TeiRelationshipSearchResults = withStyles(getStyles)(TeiRelationshipSearchResultsPlain);
