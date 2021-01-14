// @flow

import { connect } from 'react-redux';
import QuickSelector from './QuickSelector.component';
import { convertValue } from '../../../converters/clientToView';
import { dataElementTypes } from '../../../metaData/DataElement';
import { clearTrackedEntityInstanceSelection, setEnrollmentSelection } from '../LockedSelector.actions';

const buildEnrollmentsAsOptions = (enrollments = [], selectedProgramId) =>
    enrollments
        .filter(({ program }) => program === selectedProgramId)
        .map(({ created, enrollment }) => (
            {
                label: convertValue(created, dataElementTypes.DATETIME),
                value: enrollment,
            }
        ));
const mapStateToProps = (state: Object) => {
    const { currentSelections, app, enrollmentPage, organisationUnits } = state;
    const enrollmentsAsOptions = buildEnrollmentsAsOptions(enrollmentPage.enrollments, currentSelections.programId);

    return {
        selectedProgramId: currentSelections.programId,
        selectedCategories: currentSelections.categoriesMeta,
        selectedOrgUnitId: currentSelections.orgUnitId,
        selectedEnrollmentId: currentSelections.enrollmentId,
        selectedOrgUnit: currentSelections.orgUnitId ? organisationUnits[currentSelections.orgUnitId] : null,
        currentPage: app.page,
        selectedTeiName: enrollmentPage.trackedEntityInstanceDisplayName,
        enrollmentsAsOptions,
        enrollmentLockedSelectReady: enrollmentPage.enrollments && enrollmentPage.enrollments.length,
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
