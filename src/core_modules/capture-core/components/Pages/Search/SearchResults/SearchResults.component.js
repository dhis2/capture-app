// @flow
import React, { type ComponentType, useContext, useState } from 'react';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { Pagination } from 'capture-ui';
import { Button, colors } from '@dhis2/ui';
import { useDispatch } from 'react-redux';
import { CardList } from '../../../CardList';
import { withNavigation } from '../../../Pagination/withDefaultNavigation';
import { searchScopes } from '../SearchPage.constants';
import type { Props } from './SearchResults.types';
import { availableCardListButtonState, enrollmentTypes } from '../../../CardList/CardList.constants';
import { SearchResultsHeader } from '../../../SearchResultsHeader';
import { ResultsPageSizeContext } from '../../shared-contexts';
import { useScopeInfo } from '../../../../hooks/useScopeInfo';
import {
    navigateToEnrollmentOverview,
} from '../../../../actions/navigateToEnrollmentOverview/navigateToEnrollmentOverview.actions';
import { Widget } from '../../../Widget';

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
});

const buttonStyles = (theme: Theme) => ({
    buttonMargin: {
        marginLeft: theme.typography.pxToRem(8),
    },
});

const CardListButtons = withStyles(buttonStyles)(
    ({
        currentSearchScopeId,
        currentSearchScopeType,
        id,
        orgUnitId,
        enrollmentType,
        programName,
        classes,
    }) => {
        const deriveNavigationButtonState =
          (type): $Keys<typeof availableCardListButtonState> => {
              switch (type) {
              case enrollmentTypes.ACTIVE:
                  return availableCardListButtonState.SHOW_VIEW_ACTIVE_ENROLLMENT_BUTTON;
              case enrollmentTypes.CANCELLED:
              case enrollmentTypes.COMPLETED:
                  return availableCardListButtonState.SHOW_RE_ENROLLMENT_BUTTON;
              default:
                  return availableCardListButtonState.DONT_SHOW_BUTTON;
              }
          };
        const dispatch = useDispatch();

        const navigationButtonsState = deriveNavigationButtonState(enrollmentType);

        const onHandleClick = () => {
            switch (currentSearchScopeType) {
            case searchScopes.PROGRAM:
                dispatch(navigateToEnrollmentOverview({
                    teiId: id,
                    programId: currentSearchScopeId,
                    orgUnitId,
                }));
                break;
            case searchScopes.TRACKED_ENTITY_TYPE:
                dispatch(navigateToEnrollmentOverview({
                    teiId: id,
                    orgUnitId,
                }));
                break;
            default:
                break;
            }
        };

        return (
            <>
                <Button
                    small
                    dataTest="view-dashboard-button"
                    onClick={onHandleClick}
                >
                    {i18n.t('View dashboard')}
                </Button>
                {
                    navigationButtonsState === availableCardListButtonState.SHOW_VIEW_ACTIVE_ENROLLMENT_BUTTON &&
                    <Button
                        small
                        className={classes.buttonMargin}
                        dataTest="view-active-enrollment-button"
                        onClick={onHandleClick}
                    >
                        {i18n.t('View active enrollment')}
                    </Button>
                }
                {
                    navigationButtonsState === availableCardListButtonState.SHOW_RE_ENROLLMENT_BUTTON &&
                    <Button
                        small
                        className={classes.buttonMargin}
                        dataTest="re-enrollment-button"
                        onClick={onHandleClick}
                    >
                        {i18n.t('Re-enroll')} {programName && `${i18n.t('in')} ${programName}`}
                    </Button>
                }
            </>
        );
    });

export const SearchResultsIndex = ({
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
    fallbackTriggered,
    handleCreateNew,
}: Props) => {
    const { resultsPageSize } = useContext(ResultsPageSizeContext);
    const [isTopResultsOpen, setTopResultsOpen] = useState(true);
    const [isOtherResultsOpen, setOtherResultsOpen] = useState(true);
    const handlePageChange = (newPage) => {
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

    const handleOtherPageChange = (newOtherPage) => {
        startFallbackSearch({
            programId: currentSearchScopeId,
            formId: currentFormId,
            resultsPageSize,
            page: newOtherPage,
        });
    };

    const handleFallbackSearch = () => {
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
                currentProgramId={currentProgramId}
                items={searchResults}
                dataElements={dataElements}
                renderCustomCardActions={({ item, enrollmentType, programName }) => (
                    <CardListButtons
                        programName={programName}
                        currentSearchScopeId={currentSearchScopeId}
                        currentSearchScopeType={currentSearchScopeType}
                        id={item.id}
                        orgUnitId={item.tei.orgUnit}
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
            header={<SearchResultsHeader currentSearchScopeName={i18n.t('all programs')} />}
            borderless
            open={isOtherResultsOpen}
            onClose={() => setOtherResultsOpen(false)}
            onOpen={() => setOtherResultsOpen(true)}
        >
            <CardList
                noItemsText={i18n.t('No results found')}
                currentSearchScopeName={currentSearchScopeName}
                items={otherResults}
                dataElements={dataElements}
                renderCustomCardActions={({ item, enrollmentType, programName, programId: currentScopeProgramId }) => (<CardListButtons
                    programName={programName}
                    currentSearchScopeType={currentSearchScopeType}
                    currentSearchScopeId={currentScopeProgramId}
                    id={item.id}
                    orgUnitId={item.tei.orgUnit}
                    enrollmentType={enrollmentType}
                />)}
            />
            <div className={classes.pagination}>
                <SearchPagination
                    nextPageButtonDisabled={otherResults.length < resultsPageSize}
                    onChangePage={newPage => handleOtherPageChange(newPage)}
                    currentPage={otherCurrentPage}
                />
            </div>
        </Widget>}
        {
            currentSearchScopeType === searchScopes.PROGRAM && !fallbackTriggered && otherResults === undefined &&

                <div className={classes.bottom}>
                    <div className={classes.bottomText}>
                        {i18n.t('Not finding the results you were looking for? Try to search all programs that use type ')}&quot;{trackedEntityName}&quot;.
                    </div>

                    <Button onClick={handleFallbackSearch} dataTest="fallback-search-button">
                        {i18n.t('Search in all programs')}
                    </Button>
                </div>
        }
        <div className={classes.bottom}>
            <div className={classes.bottomText}>
                {i18n.t('If none of search results match, you can create a new ')}&quot;{trackedEntityName}&quot;.
            </div>

            <Button onClick={handleCreateNew} dataTest="create-new-button">
                {i18n.t('Create new')}
            </Button>
        </div>
    </>);
};

export const SearchResultsComponent: ComponentType<Props> = withStyles(getStyles)(SearchResultsIndex);
