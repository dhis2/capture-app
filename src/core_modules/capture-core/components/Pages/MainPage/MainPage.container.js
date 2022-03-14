// @flow
import React, { useEffect, useMemo } from 'react';
// $FlowFixMe
import { connect, useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { programCollection } from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
import { MainPageComponent } from './MainPage.component';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';
import { updateShowAccessibleStatus } from '../actions/crossPage.actions';
import { buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import { MainPageStatuses } from './MainPage.constants';
import { OrgUnitFetcher } from '../../OrgUnitFetcher';

const mapStateToProps = (state: ReduxState) => ({
    error: state.activePage.selectionsError && state.activePage.selectionsError.error, // TODO: Should probably remove this
    ready: !state.activePage.lockedSelectorLoads,  // TODO: Should probably remove this
});

const MainPageContainer = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { all } = useLocationQuery();
    const showAllAccessible = all !== undefined;

    const {
        currentSelectionsComplete,
        programId,
        orgUnitId,
        categories,
    } = useSelector(
        ({ currentSelections }) => ({
            currentSelectionsComplete: currentSelections.complete,
            programId: currentSelections.programId,
            orgUnitId: currentSelections.orgUnitId,
            categories: currentSelections.categories,
        }),
        shallowEqual,
    );

    useEffect(() => {
        dispatch(updateShowAccessibleStatus(showAllAccessible));
    }, [showAllAccessible, dispatch]);

    const setShowAccessible = () => history
        .push(`/?${buildUrlQueryString({ programId })}&all`);

    const MainPageStatus = useMemo(() => {
        const selectedProgram = programId && programCollection.get(programId);
        if (selectedProgram?.categoryCombination) {
            if (!categories) return MainPageStatuses.WITHOUT_PROGRAM_CATEGORY_SELECTED;
            const programCategories = Array.from(selectedProgram.categoryCombination.categories.values());

            if (programCategories.some(category => !categories || !categories[category.id])) {
                return MainPageStatuses.WITHOUT_PROGRAM_CATEGORY_SELECTED;
            }

            if (!orgUnitId && !showAllAccessible) {
                return MainPageStatuses.WITHOUT_ORG_UNIT_SELECTED;
            }

            return MainPageStatuses.SHOW_WORKING_LIST;
        }

        if (currentSelectionsComplete || (programId && showAllAccessible)) {
            return MainPageStatuses.SHOW_WORKING_LIST;
        } else if (programId && !orgUnitId) {
            return MainPageStatuses.WITHOUT_ORG_UNIT_SELECTED;
        }
        return MainPageStatuses.DEFAULT;
    },
    [categories, currentSelectionsComplete, orgUnitId, programId, showAllAccessible]);

    return (
        <OrgUnitFetcher orgUnitId={orgUnitId}>
            <MainPageComponent
                MainPageStatus={MainPageStatus}
                programId={programId}
                orgUnitId={orgUnitId}
                setShowAccessible={setShowAccessible}
            />
        </OrgUnitFetcher>
    );
};

// $FlowFixMe[missing-annot] automated comment
export const MainPage = connect(mapStateToProps)(withLoadingIndicator()(withErrorMessageHandler()(MainPageContainer)));
