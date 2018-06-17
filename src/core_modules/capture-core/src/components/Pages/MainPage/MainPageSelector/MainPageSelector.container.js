// @flow
import { connect } from 'react-redux';
import MainPageSelector from './MainPageSelector.component';
import { resetOrgUnitIdFromMainPage, setOrgUnitFromMainPage, setProgramIdFromMainPage, resetProgramIdFromMainPage, setCategoryOptionFromMainPage, resetCategoryOptionFromMainPage, resetAllCategoryOptionsFromMainPage, openNewEventPageFromMainPage } from './MainPageSelector.actions';

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
    onResetProgramId: () => {
        dispatch(resetProgramIdFromMainPage());
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
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(MainPageSelector);
