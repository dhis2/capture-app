// @flow
import React, { useCallback, useEffect, useMemo, useState } from 'react';
// $FlowFixMe
import { connect, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { programCollection } from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
import { MainPageComponent } from './MainPage.component';
import { withLoadingIndicator } from '../../../HOC';
import { updateShowAccessibleStatus } from '../actions/crossPage.actions';
import { useNavigate, buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import { MainPageStatuses } from './MainPage.constants';
import { OrgUnitFetcher } from '../../OrgUnitFetcher';
import { useCategoryOptionIsValidForOrgUnit } from '../../../hooks/useCategoryComboIsValidForOrgUnit';
import { TopBar } from './TopBar.container';

const mapStateToProps = (state: ReduxState) => ({
    error: state.activePage.selectionsError && state.activePage.selectionsError.error, // TODO: Should probably remove this
    ready: !state.activePage.lockedSelectorLoads,  // TODO: Should probably remove this
});

const handleChangeTemplateUrl = ({ programId, orgUnitId, selectedTemplateId, showAllAccessible, navigate }) => {
    if (orgUnitId) {
        selectedTemplateId
            ? navigate(`/?${buildUrlQueryString({ orgUnitId, programId, selectedTemplateId })}`)
            : navigate(`/?${buildUrlQueryString({ orgUnitId, programId })}`);
    }
    if (showAllAccessible) {
        selectedTemplateId
            ? navigate(`/?${buildUrlQueryString({ programId, selectedTemplateId })}&all`)
            : navigate(`/?${buildUrlQueryString({ programId })}&all`);
    }
};

const useMainPageStatus = ({
    programId,
    selectedProgram,
    categories,
    orgUnitId,
    showAllAccessible,
    categoryOptionIsInvalidForOrgUnit,
    showBatchDataEntryPlugin,
}) => {
    const withoutOrgUnit = useMemo(() => !orgUnitId && !showAllAccessible, [orgUnitId, showAllAccessible]);

    return useMemo(() => {
        if (showBatchDataEntryPlugin) return MainPageStatuses.SHOW_BATCH_DATA_ENTRY_PLUGIN;

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
    }, [programId, selectedProgram, withoutOrgUnit, categories, categoryOptionIsInvalidForOrgUnit, showBatchDataEntryPlugin]);
};

const useSelectorMainPage = () =>
    useSelector(
        ({ currentSelections, activePage, workingListsTemplates, workingListsContext }) => ({
            categories: currentSelections.categories,
            selectedCategories: currentSelections.categoriesMeta,
            reduxSelectedTemplateId: workingListsTemplates.teiList?.selectedTemplateId,
            workingListProgramId: workingListsContext.teiList?.programIdView,
            ready: !activePage.isLoading && !activePage.lockedSelectorLoads,
            error: activePage.selectionsError && activePage.selectionsError.error,
        }),
        shallowEqual,
    );

const useCallbackMainPage = ({ orgUnitId, programId, showAllAccessible, navigate }) => {
    const onChangeTemplate = useCallback(
        id => handleChangeTemplateUrl({ programId, orgUnitId, selectedTemplateId: id, showAllAccessible, navigate }),
        [navigate, orgUnitId, programId, showAllAccessible],
    );

    const onSetShowAccessible = useCallback(
        () => navigate(`/?${buildUrlQueryString({ programId })}&all`),
        [navigate, programId],
    );

    return {
        onChangeTemplate,
        onSetShowAccessible,
    };
};

const MainPageContainer = () => {
    const [showBatchDataEntryPlugin, setShowBatchDataEntryPlugin] = useState(false);
    const dispatch = useDispatch();
    const { navigate } = useNavigate();
    const { all, programId, orgUnitId, selectedTemplateId } = useLocationQuery();
    const showAllAccessible = all !== undefined;

    const {
        categories,
        selectedCategories,
        reduxSelectedTemplateId,
        workingListProgramId,
        error,
        ready,
    } = useSelectorMainPage();
    const { categoryOptionIsInvalidForOrgUnit } = useCategoryOptionIsValidForOrgUnit({ selectedOrgUnitId: orgUnitId });

    const selectedProgram = programCollection.get(programId);
    // $FlowFixMe[prop-missing]
    const trackedEntityType = selectedProgram?.trackedEntityType;
    const trackedEntityTypeId = trackedEntityType?.id;
    const displayFrontPageList = trackedEntityTypeId && selectedProgram?.displayFrontPageList;
    const MainPageStatus = useMainPageStatus({
        programId,
        selectedProgram,
        categories,
        orgUnitId,
        showAllAccessible,
        categoryOptionIsInvalidForOrgUnit,
        showBatchDataEntryPlugin,
    });

    const {
        onChangeTemplate,
        onSetShowAccessible,
    } = useCallbackMainPage({ orgUnitId, programId, showAllAccessible, navigate, dispatch });

    useEffect(() => {
        dispatch(updateShowAccessibleStatus(showAllAccessible));
    }, [showAllAccessible, dispatch]);

    useEffect(() => {
        if (programId && trackedEntityTypeId && selectedTemplateId === undefined) {
            if (reduxSelectedTemplateId && workingListProgramId === programId) {
                handleChangeTemplateUrl({
                    programId,
                    orgUnitId,
                    selectedTemplateId: reduxSelectedTemplateId,
                    showAllAccessible,
                    navigate,
                });
                return;
            }
            if (!displayFrontPageList) return;
            handleChangeTemplateUrl({
                programId,
                orgUnitId,
                selectedTemplateId: `${programId}-default`,
                showAllAccessible,
                navigate,
            });
        }
    }, [
        selectedTemplateId,
        orgUnitId,
        programId,
        showAllAccessible,
        trackedEntityTypeId,
        displayFrontPageList,
        navigate,
        reduxSelectedTemplateId,
        workingListProgramId,
    ]);

    return (
        <OrgUnitFetcher orgUnitId={orgUnitId} error={error}>
            <TopBar programId={programId} orgUnitId={orgUnitId} selectedCategories={selectedCategories} />
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
                trackedEntityName={trackedEntityType?.name}
                setShowBatchDataEntryPlugin={setShowBatchDataEntryPlugin}
            />
        </OrgUnitFetcher>
    );
};

// $FlowFixMe[missing-annot] automated comment
export const MainPage = connect(mapStateToProps)(withLoadingIndicator()(MainPageContainer));
