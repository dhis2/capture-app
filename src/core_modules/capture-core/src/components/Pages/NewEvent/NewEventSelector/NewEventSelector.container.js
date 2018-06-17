// @flow
import { connect } from 'react-redux';
import NewEventSelector from './NewEventSelector.component';
import { resetOrgUnitIdFromNewEventPage, setOrgUnitFromNewEventPage, setProgramIdFromNewEventPage, resetProgramIdFromNewEventPage, setCategoryOptionFromNewEventPage, resetCategoryOptionFromNewEventPage, resetAllCategoryOptionsFromNewEventPage } from './NewEventSelector.actions';

const mapStateToProps = (state: ReduxState) => ({
    
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSetOrgUnit: (id: string, orgUnit: Object) => {
        dispatch(setOrgUnitFromNewEventPage(id, orgUnit));
    },
    onResetOrgUnitId: () => {
        dispatch(resetOrgUnitIdFromNewEventPage());
    },
    onSetProgramId: (id: string) => {
        dispatch(setProgramIdFromNewEventPage(id));
    },
    onResetProgramId: () => {
        dispatch(resetProgramIdFromNewEventPage());
    },
    onSetCategoryOption: (categoryId: string, categoryOptionId: string) => {
        dispatch(setCategoryOptionFromNewEventPage(categoryId, categoryOptionId));
    },
    onResetCategoryOption: (categoryId: string) => {
        dispatch(resetCategoryOptionFromNewEventPage(categoryId));
    },
    onResetAllCategoryOptions: () => {
        dispatch(resetAllCategoryOptionsFromNewEventPage());
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(NewEventSelector);
