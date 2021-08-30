// @flow
import React, { useEffect, useMemo } from 'react';
// $FlowFixMe
import { connect, useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { MainPageComponent } from './MainPage.component';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';
import { updateShowAccessibleStatus } from '../actions/crossPage.actions';
import { urlArguments } from '../../../utils/url';
import { MainPageStatuses } from './MainPage.constants';

const mapStateToProps = (state: ReduxState) => ({
    error: state.activePage.selectionsError && state.activePage.selectionsError.error, // TODO: Should probably remove this
    ready: !state.activePage.lockedSelectorLoads,  // TODO: Should probably remove this
});

const MainPageContainer = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { showAllAccessible } = useSelector(
        ({
            router: {
                location: {
                    query,
                },
            },
        }) => ({
            showAllAccessible: query.hasOwnProperty('all'),
        }));

    const {
        currentSelectionsComplete,
        programId,
        orgUnitId,
    } = useSelector(
        ({ currentSelections }) => ({
            currentSelectionsComplete: currentSelections.complete,
            programId: currentSelections.programId,
            orgUnitId: currentSelections.orgUnitId,
        }),
        shallowEqual,
    );

    useEffect(() => {
        dispatch(updateShowAccessibleStatus(showAllAccessible));
    }, [showAllAccessible, dispatch]);

    const setShowAccessible = () => history
        .push(`/?${urlArguments({ programId })}&all`);

    const MainPageStatus = useMemo(() => {
        if (currentSelectionsComplete || (programId && showAllAccessible)) {
            return MainPageStatuses.SHOW_WORKING_LIST;
        } else if (programId && !orgUnitId) {
            return MainPageStatuses.WITHOUT_ORG_UNIT_SELECTED;
        }
        return MainPageStatuses.DEFAULT;
    },
    [currentSelectionsComplete, orgUnitId, programId, showAllAccessible]);

    return (
        <MainPageComponent
            MainPageStatus={MainPageStatus}
            programId={programId}
            orgUnitId={orgUnitId}
            setShowAccessible={setShowAccessible}
        />
    );
};

// $FlowFixMe[missing-annot] automated comment
export const MainPage = connect(mapStateToProps)(withLoadingIndicator()(withErrorMessageHandler()(MainPageContainer)));
