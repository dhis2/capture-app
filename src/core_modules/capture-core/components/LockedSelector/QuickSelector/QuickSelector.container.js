// @flow

import { connect } from 'react-redux';
import QuickSelector from './QuickSelector.component';
import { convertValue } from '../../../converters/clientToView';
import { dataElementTypes } from '../../../metaData/DataElement';
import {
    resetEnrollmentSelection,
    resetTeiSelection,
    setEnrollmentSelection,
} from '../LockedSelector.actions';
import { deriveUrlQueries } from '../../../utils/url';

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
    const { orgUnitId, programId } = deriveUrlQueries(state);
    const {
        router: { location: { pathname, query: { enrollmentId } } },
        currentSelections: { categoriesMeta },
        organisationUnits,
        enrollmentPage,
    } = state;

    const enrollmentsAsOptions = buildEnrollmentsAsOptions(enrollmentPage.enrollments, programId);
    return {
        selectedProgramId: programId,
        selectedOrgUnitId: orgUnitId,
        selectedCategories: categoriesMeta,
        selectedOrgUnit: orgUnitId ? organisationUnits[orgUnitId] : null,
        currentPage: pathname.substring(1),
        selectedTeiName: enrollmentPage.trackedEntityInstanceDisplayName,
        selectedEnrollmentId: enrollmentId,
        enrollmentsAsOptions,
        enrollmentLockedSelectReady: enrollmentPage.enrollments && enrollmentPage.enrollments.length,
    };
};


const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onTeiSelectionReset: () => {
        dispatch(resetTeiSelection());
    },
    onEnrollmentSelectionSet: (enrollmentId) => {
        dispatch(setEnrollmentSelection({ enrollmentId }));
    },
    onEnrollmentSelectionReset: () => {
        dispatch(resetEnrollmentSelection());
    },
});

// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, mapDispatchToProps)(QuickSelector);
