// @flow
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import MainPageSelector from './MainPageSelector.component';
import {
    resetOrgUnitIdFromMainPage,
    setOrgUnitFromMainPage,
    setProgramIdFromMainPage,
    resetProgramIdFromMainPage,
    setCategoryOptionFromMainPage,
    resetCategoryOptionFromMainPage,
    resetAllCategoryOptionsFromMainPage,
    openNewEventPageFromMainPage,
    batchActionTypes,
} from './MainPageSelector.actions';
import { resetProgramIdBase } from '../../../QuickSelector/actions/QuickSelector.actions';

const mapStateToProps = (state: ReduxState) => ({
    selectedProgramId: state.currentSelections.programId,
    selectedOrgUnitId: state.currentSelections.orgUnitId,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSetOrgUnit: (id: string, orgUnit: Object) => {
        dispatch(setOrgUnitFromMainPage(id, orgUnit));
    },
    onResetOrgUnitId: () => {
        dispatch(resetOrgUnitIdFromMainPage());
    },
    onSetProgramId: (id: string) => {
        dispatch(setProgramIdFromMainPage(id));
    },
    onSetCategoryOption: (categoryId: string, categoryOptionId: string) => {
        dispatch(setCategoryOptionFromMainPage(categoryId, categoryOptionId));
    },
    onResetCategoryOption: (categoryId: string) => {
        dispatch(resetCategoryOptionFromMainPage(categoryId));
    },
    onResetAllCategoryOptions: () => {
        dispatch(resetAllCategoryOptionsFromMainPage());
    },
    onOpenNewEventPage: (programId: string, orgUnitId: string) => {
        dispatch(openNewEventPageFromMainPage(programId, orgUnitId));
    },
    onStartAgain: () => {
        dispatch(batchActions([
            resetOrgUnitIdFromMainPage(),
            resetProgramIdFromMainPage(),
            resetAllCategoryOptionsFromMainPage(),
            resetProgramIdBase(),
        ], batchActionTypes.START_AGAIN));
    },
    onResetProgramId: (baseAction: ReduxAction<any, any>) => {
        dispatch(batchActions([
            resetProgramIdFromMainPage(),
            resetAllCategoryOptionsFromMainPage(),
            baseAction,
        ], batchActionTypes.RESET_PROGRAM_AND_CATEGORY_OPTION));
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(MainPageSelector);
