import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

type ReduxState = {
    activePage: {
        selectionsError?: { error: boolean };
        lockedSelectorLoads: boolean;
        isLoading: boolean;
    };
    currentSelections: {
        categories: any;
        categoriesMeta: any;
    };
    workingListsTemplates: {
        teiList?: { selectedTemplateId: string };
    };
    workingListsContext: {
        teiList?: { programIdView: string };
    };
};

const mapStateToProps = (state: ReduxState) => ({
    error: state.activePage.selectionsError && state.activePage.selectionsError.error,
    ready: !state.activePage.lockedSelectorLoads,
});

const handleChangeTemplateUrl = ({ programId, orgUnitId, selectedTemplateId, showAllAccessible, navigate }: {
    programId: string;
    orgUnitId?: string;
    selectedTemplateId?: string;
    showAllAccessible: boolean;
    navigate: (url: string) => void;
}) => {
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
    showBulkDataEntryPlugin,
}: {
    programId?: string;
    selectedProgram?: any;
    categories?: any;
    orgUnitId?: string;
    showAllAccessible: boolean;
    categoryOptionIsInvalidForOrgUnit: boolean;
    showBulkDataEntryPlugin: boolean;
}) => {
    const withoutOrgUnit = useMemo(() => !orgUnitId && !showAllAccessible, [orgUnitId, showAllAccessible]);

    return useMemo(() => {
        if (showBulkDataEntryPlugin) return MainPageStatuses.SHOW_BULK_DATA_ENTRY_PLUGIN;

        if (!programId) return MainPageStatuses.DEFAULT;

        if (selectedProgram?.categoryCombination) {
            if (!categories) return MainPageStatuses.WITHOUT_PROGRAM_CATEGORY_SELECTED;
            const programCategories = Array.from(selectedProgram.categoryCombination.categories.values());
            if (programCategories.some((category: any) => !categories || !categories[category.id])) {
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
    }, [programId, selectedProgram, withoutOrgUnit, categories, categoryOptionIsInvalidForOrgUnit, showBulkDataEntryPlugin]);
};

const useSelectorMainPage = () =>
    useSelector(
        ({ currentSelections, activePage, workingListsTemplates, workingListsContext }: ReduxState) => ({
            categories: currentSelections.categories,
            selectedCategories: currentSelections.categoriesMeta,
            reduxSelectedTemplateId: workingListsTemplates.teiList?.selectedTemplateId,
            workingListProgramId: workingListsContext.teiList?.programIdView,
            ready: !activePage.isLoading && !activePage.lockedSelectorLoads,
            error: activePage.selectionsError && activePage.selectionsError.error,
        }),
        shallowEqual,
    );

const useCallbackMainPage = ({
    orgUnitId,
    programId,
    showAllAccessible,
    navigate,
    setShowBulkDataEntryPlugin,
    setBulkDataEntryTrackedEntityIds,
}: {
    orgUnitId?: string;
    programId?: string;
    showAllAccessible: boolean;
    navigate: (url: string) => void;
    setShowBulkDataEntryPlugin: (show: boolean) => void;
    setBulkDataEntryTrackedEntityIds: (ids?: Array<string>) => void;
}) => {
    const onChangeTemplate = useCallback(
        (id?: string) => handleChangeTemplateUrl({ programId: programId || '', orgUnitId, selectedTemplateId: id, showAllAccessible, navigate }),
        [navigate, orgUnitId, programId, showAllAccessible],
    );

    const onSetShowAccessible = useCallback(
        () => navigate(`/?${buildUrlQueryString({ programId: programId || '' })}&all`),
        [navigate, programId],
    );

    const onCloseBulkDataEntryPlugin = useCallback(() => {
        setBulkDataEntryTrackedEntityIds(undefined);
        setShowBulkDataEntryPlugin(false);
    }, [setBulkDataEntryTrackedEntityIds, setShowBulkDataEntryPlugin]);

    const onOpenBulkDataEntryPlugin = useCallback((trackedEntityIds?: Array<string>) => {
        setBulkDataEntryTrackedEntityIds(trackedEntityIds);
        setShowBulkDataEntryPlugin(true);
    }, [setBulkDataEntryTrackedEntityIds, setShowBulkDataEntryPlugin]);

    return {
        onChangeTemplate,
        onSetShowAccessible,
        onCloseBulkDataEntryPlugin,
        onOpenBulkDataEntryPlugin,
    };
};

const MainPageContainer = () => {
    const [showBulkDataEntryPlugin, setShowBulkDataEntryPlugin] = useState(false);
    const [bulkDataEntryTrackedEntityIds, setBulkDataEntryTrackedEntityIds] = useState<Array<string> | undefined>(undefined);

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
    const trackedEntityTypeId = selectedProgram?.trackedEntityType?.id;
    const displayFrontPageList = trackedEntityTypeId && selectedProgram?.displayFrontPageList;
    const MainPageStatus = useMainPageStatus({
        programId,
        selectedProgram,
        categories,
        orgUnitId,
        showAllAccessible,
        categoryOptionIsInvalidForOrgUnit,
        showBulkDataEntryPlugin,
    });

    const { onChangeTemplate, onSetShowAccessible, onCloseBulkDataEntryPlugin, onOpenBulkDataEntryPlugin } =
        useCallbackMainPage({
            orgUnitId,
            programId,
            showAllAccessible,
            navigate,
            setShowBulkDataEntryPlugin,
            setBulkDataEntryTrackedEntityIds,
        });

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
                programId={programId || ''}
                orgUnitId={orgUnitId || ''}
                trackedEntityTypeId={trackedEntityTypeId}
                selectedTemplateId={selectedTemplateId}
                setShowAccessible={onSetShowAccessible}
                onChangeTemplate={onChangeTemplate}
                error={error || false}
                ready={ready}
                displayFrontPageList={displayFrontPageList}
                onCloseBulkDataEntryPlugin={onCloseBulkDataEntryPlugin}
                onOpenBulkDataEntryPlugin={onOpenBulkDataEntryPlugin}
                bulkDataEntryTrackedEntityIds={bulkDataEntryTrackedEntityIds}
            />
        </OrgUnitFetcher>
    );
};

export const MainPage = connect(mapStateToProps)(withLoadingIndicator()(MainPageContainer));
