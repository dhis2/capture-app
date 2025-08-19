import React, {
    type ComponentType,
    useContext,
    useState,
    useEffect,
} from 'react';
import { withStyles, type WithStyles } from '@material-ui/core';
import type { Theme } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Pagination } from 'capture-ui';
import { Button, CircularLoader, colors } from '@dhis2/ui';
import { ConditionalTooltip } from 'capture-core/components/Tooltips/ConditionalTooltip';
import { CardList, CardListButtons } from '../../CardList';
import { withNavigation } from '../../Pagination/withDefaultNavigation';
import { searchScopes } from '../SearchBox.constants';
import type { Props } from './SearchResults.types';
import { SearchResultsHeader } from '../../SearchResultsHeader';
import { ResultsPageSizeContext } from '../../Pages/shared-contexts';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { Widget } from '../../Widget';
import { getTrackerProgramThrowIfNotFound } from '../../../metaData';

const SearchPagination = withNavigation()(Pagination);

export const getStyles = (theme: Theme) => ({
    pagination: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginLeft: theme.typography.pxToRem(8),
        width: theme.typography.pxToRem(600),
    },
    bottom: {
        marginLeft: theme.typography.pxToRem(8),
    },
    bottomText: {
        color: colors.grey800,
        marginTop: theme.typography.pxToRem(12),
        marginBottom: theme.typography.pxToRem(12),
    },
    loadingMask: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: theme.typography.pxToRem(545),
    },
});

const SearchResultsIndex = ({
    searchViaAttributesOnScopeProgram,
    searchViaAttributesOnScopeTrackedEntityType,
    startFallbackSearch,
    classes,
    searchResults,
    otherResults,
    otherCurrentPage,
    dataElements,
    currentPage,
    currentSearchScopeType,
    currentSearchScopeId,
    currentSearchScopeName,
    currentFormId,
    currentSearchTerms,
    handleCreateNew,
    orgUnitId,
}: Props & WithStyles<typeof getStyles>) => {
    const { resultsPageSize } = useContext(ResultsPageSizeContext) as any;
    const [isTopResultsOpen, setTopResultsOpen] = useState(true);
    const [isOtherResultsOpen, setOtherResultsOpen] = useState(true);
    const [isFallbackLoading, setIsFallbackLoading] = useState(false);

    const availableSearchGroup =
        currentSearchScopeType === searchScopes.PROGRAM
            ? getTrackerProgramThrowIfNotFound(currentSearchScopeId)
                .trackedEntityType.searchGroups.find(group => !group.unique)
            : undefined;

    const handlePageChange = (newPage: any) => {
        switch (currentSearchScopeType) {
        case searchScopes.PROGRAM:
            searchViaAttributesOnScopeProgram({
                programId: currentSearchScopeId,
                formId: currentFormId,
                page: newPage,
                resultsPageSize,
            });
            break;
        case searchScopes.TRACKED_ENTITY_TYPE:
            searchViaAttributesOnScopeTrackedEntityType({
                trackedEntityTypeId: currentSearchScopeId,
                formId: currentFormId,
                page: newPage,
                resultsPageSize,
            });
            break;
        default:
            break;
        }
    };

    const handleOtherPageChange = (newOtherPage: any) => {
        setIsFallbackLoading(true);
        startFallbackSearch({
            programId: currentSearchScopeId,
            formId: currentFormId,
            resultsPageSize,
            page: newOtherPage,
        });
    };

    useEffect(() => {
        if (otherResults !== undefined) {
            setIsFallbackLoading(false);
        }
    }, [otherResults]);

    const handleFallbackSearch = () => {
        setIsFallbackLoading(true);
        startFallbackSearch({
            programId: currentSearchScopeId,
            formId: currentFormId,
            resultsPageSize,
        });
    };
    const currentProgramId = (currentSearchScopeType === searchScopes.PROGRAM) ? currentSearchScopeId : '';

    const { trackedEntityName } = useScopeInfo(currentSearchScopeId);

    return (<>
        <Widget
            header={<SearchResultsHeader
                currentSearchTerms={currentSearchTerms}
                currentSearchScopeName={currentSearchScopeName}
            />
            }
            borderless
            open={isTopResultsOpen}
            onClose={() => setTopResultsOpen(false)}
            onOpen={() => setTopResultsOpen(true)}
        >
            <CardList
                noItemsText={i18n.t('No results found')}
                currentSearchScopeName={currentSearchScopeName}
                currentSearchScopeType={currentSearchScopeType}
                currentProgramId={currentProgramId}
                items={searchResults}
                dataElements={dataElements}
                renderCustomCardActions={({ item, enrollmentType, programName }: any) => (
                    <CardListButtons
                        programName={programName}
                        currentSearchScopeId={currentSearchScopeId}
                        currentSearchScopeType={currentSearchScopeType as any}
                        id={item.id}
                        orgUnitId={orgUnitId}
                        enrollmentType={enrollmentType}
                    />
                )}
            />
            <div className={classes.pagination}>
                <SearchPagination
                    nextPageButtonDisabled={searchResults.length < resultsPageSize}
                    onChangePage={newPage => handlePageChange(newPage)}
                    currentPage={currentPage}
                />
            </div>
        </Widget>

        {otherResults !== undefined && <Widget
            header={<SearchResultsHeader currentSearchScopeName={i18n.t('all programs')} currentSearchTerms={[]} />}
            borderless
            open={isOtherResultsOpen}
            onClose={() => setOtherResultsOpen(false)}
            onOpen={() => setOtherResultsOpen(true)}
        >
            {isFallbackLoading ? (
                <div className={classes.loadingMask}>
                    <CircularLoader />
                </div>
            ) : (
                <CardList
                    noItemsText={i18n.t('No results found')}
                    currentSearchScopeName={currentSearchScopeName}
                    currentSearchScopeType={searchScopes.ALL_PROGRAMS}
                    items={otherResults}
                    dataElements={dataElements}
                    renderCustomCardActions={({
                        item, enrollmentType, currentSearchScopeType: searchScopeType, programName,
                    }: any) => (<CardListButtons
                        programName={programName}
                        currentSearchScopeType={searchScopeType}
                        currentSearchScopeId={currentSearchScopeId}
                        id={item.id}
                        orgUnitId={orgUnitId}
                        enrollmentType={enrollmentType}
                    />)}
                />
            )}
            <div className={classes.pagination}>
                <SearchPagination
                    nextPageButtonDisabled={otherResults.length < resultsPageSize}
                    onChangePage={newPage => handleOtherPageChange(newPage)}
                    currentPage={otherCurrentPage}
                />
            </div>
        </Widget>}
        {
            currentSearchScopeType === searchScopes.PROGRAM && otherResults === undefined &&
            <div className={classes.bottom}>
                <div className={classes.bottomText}>
                    {i18n.t('Not finding the results you were looking for? Try searching in all programs.')}
                </div>
                <ConditionalTooltip
                    enabled={!availableSearchGroup}
                    content={i18n.t('No searchable attributes for {{trackedEntityName}}', {
                        trackedEntityName, interpolation: { escapeValue: false },
                    })}
                >
                    <Button
                        onClick={handleFallbackSearch}
                        dataTest="fallback-search-button"
                        loading={isFallbackLoading}
                        disabled={!availableSearchGroup}
                    >
                        {i18n.t('Search in all programs')}
                    </Button>
                </ConditionalTooltip>
            </div>
        }
        <div className={classes.bottom}>
            <div className={classes.bottomText}>
                {i18n.t('If none of search results match, you can create a new {{trackedEntityName}}.', {
                    trackedEntityName, interpolation: { escapeValue: false },
                })}
            </div>

            <Button
                onClick={() => handleCreateNew(currentSearchTerms)}
                dataTest="create-new-button"
            >
                {i18n.t('Create new')}
            </Button>
        </div>
    </>);
};

export const SearchResultsComponent = withStyles(getStyles)(SearchResultsIndex) as ComponentType<Props>;
