// @flow
import React, { useEffect, useMemo, useCallback } from 'react';
// $FlowFixMe
import { connect, useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { programCollection } from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
import { MainPageComponent } from './MainPage.component';
import { withLoadingIndicator } from '../../../HOC';
import { updateShowAccessibleStatus } from '../actions/crossPage.actions';
import { buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import { MainPageStatuses } from './MainPage.constants';
import { OrgUnitFetcher } from '../../OrgUnitFetcher';
import { useCategoryOptionIsValidForOrgUnit } from '../../../hooks/useCategoryComboIsValidForOrgUnit';

const mapStateToProps = (state: ReduxState) => ({
    error: state.activePage.selectionsError && state.activePage.selectionsError.error, // TODO: Should probably remove this
    ready: !state.activePage.lockedSelectorLoads,  // TODO: Should probably remove this
});

const handleChangeTemplateUrl = ({ programId, orgUnitId, selectedTemplateId, showAllAccessible, history }) => {
    if (orgUnitId) {
        selectedTemplateId
            ? history.push(`/?${buildUrlQueryString({ orgUnitId, programId, selectedTemplateId })}`)
            : history.push(`/?${buildUrlQueryString({ orgUnitId, programId })}`);
    }
    if (showAllAccessible) {
        selectedTemplateId
            ? history.push(`/?${buildUrlQueryString({ programId, selectedTemplateId })}&all`)
            : history.push(`/?${buildUrlQueryString({ programId })}&all`);
    }
};

const useMainPageStatus = ({
    programId,
    selectedProgram,
    categories,
    orgUnitId,
    showAllAccessible,
    categoryOptionIsInvalidForOrgUnit,
}) => {
    const withoutOrgUnit = useMemo(() => !orgUnitId && !showAllAccessible, [orgUnitId, showAllAccessible]);

    return useMemo(() => {
        if (!programId) return MainPageStatuses.DEFAULT;

        if (selectedProgram?.categoryCombination) {
            if (!categories) return MainPageStatuses.WITHOUT_PROGRAM_CATEGORY_SELECTED;
            const programCategories = Array.from(selectedProgram.categoryCombination.categories.values());
            if (programCategories.some(category => !categories || !categories[category.id])) {
                return MainPageStatuses.WITHOUT_PROGRAM_CATEGORY_SELECTED;
            }
            if (withoutOrgUnit) {
                return MainPageStatuses.WITHOUT_ORG_UNIT_SELECTED;
            }
            if (programCategories && categoryOptionIsInvalidForOrgUnit) {
                return MainPageStatuses.CATEGORY_OPTION_INVALID_FOR_ORG_UNIT;
            }
            return MainPageStatuses.SHOW_WORKING_LIST;
        }

        if (withoutOrgUnit) {
            return MainPageStatuses.WITHOUT_ORG_UNIT_SELECTED;
        }

        return MainPageStatuses.SHOW_WORKING_LIST;
    }, [programId, selectedProgram, withoutOrgUnit, categories, categoryOptionIsInvalidForOrgUnit]);
};

const useSelectorMainPage = () =>
    useSelector(
        ({ currentSelections, activePage }) => ({
            categories: currentSelections.categories,
            selectedCategories: currentSelections.categoriesMeta,
            ready: !activePage.isLoading && !activePage.lockedSelectorLoads,
            error: activePage.selectionsError && activePage.selectionsError.error,
        }),
        shallowEqual,
    );

const useCallbackMainPage = ({ orgUnitId, programId, showAllAccessible, history }) => {
    const onChangeTemplate = useCallback(
        id => handleChangeTemplateUrl({ programId, orgUnitId, selectedTemplateId: id, showAllAccessible, history }),
        [history, orgUnitId, programId, showAllAccessible],
    );

    const onSetShowAccessible = useCallback(
        () => history.push(`/?${buildUrlQueryString({ programId })}&all`),
        [history, programId],
    );

    return {
        onChangeTemplate,
        onSetShowAccessible,
    };
};

const MainPageContainer = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { all, programId, orgUnitId, selectedTemplateId } = useLocationQuery();
    const showAllAccessible = all !== undefined;

    const {
        categories,
        selectedCategories,
        error,
        ready,
    } = useSelectorMainPage();
    const { categoryOptionIsInvalidForOrgUnit } = useCategoryOptionIsValidForOrgUnit({ selectedOrgUnitId: orgUnitId });

    const selectedProgram = programCollection.get(programId);
    // $FlowFixMe[prop-missing]
    const trackedEntityTypeId = selectedProgram?.trackedEntityType?.id;
    const displayFrontPageList = trackedEntityTypeId && selectedProgram?.displayFrontPageList;
    const MainPageStatus = useMainPageStatus({
        programId,
        selectedProgram,
        categories,
        orgUnitId,
        showAllAccessible,
        categoryOptionIsInvalidForOrgUnit,
    });

    const {
        onChangeTemplate,
        onSetShowAccessible,
    } = useCallbackMainPage({ orgUnitId, programId, showAllAccessible, history, dispatch });

    useEffect(() => {
        dispatch(updateShowAccessibleStatus(showAllAccessible));
    }, [showAllAccessible, dispatch]);

    useEffect(() => {
        if (programId && trackedEntityTypeId && displayFrontPageList && selectedTemplateId === undefined) {
            handleChangeTemplateUrl({
                programId,
                orgUnitId,
                selectedTemplateId: `${programId}-default`,
                showAllAccessible,
                history,
            });
        }
    }, [
        selectedTemplateId,
        orgUnitId,
        programId,
        showAllAccessible,
        trackedEntityTypeId,
        displayFrontPageList,
        history,
    ]);

    return (
        <OrgUnitFetcher orgUnitId={orgUnitId} error={error}>
            <MainPageComponent
                MainPageStatus={MainPageStatus}
                programId={programId}
                orgUnitId={orgUnitId}
                trackedEntityTypeId={trackedEntityTypeId}
                selectedTemplateId={selectedTemplateId}
                setShowAccessible={onSetShowAccessible}
                onChangeTemplate={onChangeTemplate}
                error={error}
                ready={ready}
                displayFrontPageList={displayFrontPageList}
                selectedCategories={selectedCategories}
            />
        </OrgUnitFetcher>
    );
};

// $FlowFixMe[missing-annot] automated comment
export const MainPage = connect(mapStateToProps)(withLoadingIndicator()(MainPageContainer));
