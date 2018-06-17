// @flow
import { connect } from 'react-redux';
import EditEventSelector from './EditEventSelector.component';
import { resetOrgUnitIdFromEditEventPage, setOrgUnitFromEditEventPage, setProgramIdFromEditEventPage, resetProgramIdFromEditEventPage, setCategoryOptionFromEditEventPage, resetCategoryOptionFromEditEventPage, resetAllCategoryOptionsFromEditEventPage, openNewEventPageFromEditEventPage } from './EditEventSelector.actions';

const mapStateToProps = (state: ReduxState) => ({
    selectedProgramId: state.currentSelections.programId,
    selectedOrgUnitId: state.currentSelections.orgUnitId,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSetOrgUnit: (id: string, orgUnit: Object) => {
        dispatch(setOrgUnitFromEditEventPage(id, orgUnit));
    },
    onResetOrgUnitId: () => {
        dispatch(resetOrgUnitIdFromEditEventPage());
    },
    onSetProgramId: (id: string) => {
        dispatch(setProgramIdFromEditEventPage(id));
    },
    onResetProgramId: () => {
        dispatch(resetProgramIdFromEditEventPage());
    },
    onSetCategoryOption: (categoryId: string, categoryOptionId: string) => {
        dispatch(setCategoryOptionFromEditEventPage(categoryId, categoryOptionId));
    },
    onResetCategoryOption: (categoryId: string) => {
        dispatch(resetCategoryOptionFromEditEventPage(categoryId));
    },
    onResetAllCategoryOptions: () => {
        dispatch(resetAllCategoryOptionsFromEditEventPage());
    },
    onOpenNewEventPage: (programId: string, orgUnitId: string) => {
        dispatch(openNewEventPageFromEditEventPage(programId, orgUnitId));
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(EditEventSelector);
