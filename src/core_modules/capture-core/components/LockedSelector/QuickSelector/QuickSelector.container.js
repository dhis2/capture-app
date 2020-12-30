// @flow

import { connect } from 'react-redux';
import QuickSelector from './QuickSelector.component';
import { clearTrackedEntityInstanceSelection, setEnrollmentSelection } from '../../Pages/Enrollment/EnrollmentPage.actions';
import { convertValue } from '../../../converters/clientToView';
import { dataElementTypes } from '../../../metaData/DataElement';

const buildEnrollmentsAsOptions = (enrollments = []) =>
    enrollments
        .map(({ created, enrollment }) => (
            {
                label: convertValue(created, dataElementTypes.DATETIME),
                value: enrollment,
            }
        ));
const mapStateToProps = (state: Object) => {
    const { currentSelections, app, enrollmentPage, organisationUnits } = state;
    const enrollmentsAsOptions = buildEnrollmentsAsOptions(enrollmentPage.enrollments);

    return {
        selectedProgramId: currentSelections.programId,
        selectedCategories: currentSelections.categoriesMeta,
        selectedOrgUnitId: currentSelections.orgUnitId,
        selectedEnrollmentId: currentSelections.enrollmentId,
        selectedOrgUnit: currentSelections.orgUnitId ? organisationUnits[currentSelections.orgUnitId] : null,
        currentPage: app.page,
        selectedTrackedEntityTypeName: currentSelections.trackedEntityTypeDisplayName,
        enrollmentsAsOptions,
    };
};


const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onTrackedEntityInstanceClear: () => {
        dispatch(clearTrackedEntityInstanceSelection());
    },
    onEnrollmentSelectionSet: (enrollmentId) => {
        dispatch(setEnrollmentSelection({ enrollmentId }));
    },
});

// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, mapDispatchToProps)(QuickSelector);
