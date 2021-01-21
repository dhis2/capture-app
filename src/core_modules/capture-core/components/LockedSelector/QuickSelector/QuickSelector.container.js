// @flow

import { connect } from 'react-redux';
import QuickSelector from './QuickSelector.component';
import { convertValue } from '../../../converters/clientToView';
import { dataElementTypes } from '../../../metaData/DataElement';

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
    const {
        enrollmentPage,
        organisationUnits,
        currentSelections: {
            programId: selectedProgramId,
            orgUnitId: selectedOrgUnitId,
            teiId: selectedTeiId,
            trackedEntityTypeId: selectedTet,
            enrollmentId: selectedEnrollmentId,
            categoriesMeta,
        },
        router: {
            location: {
                query: {
                    programId: routerProgramId,
                    orgUnitId: routerOrgUnitId,
                    teiId: routerTeiId,
                    trackedEntityTypeId: routerTet,
                    enrollmentId: routerEnrollmentId,
                },
                pathname,
            },
        },
    } = state;

    const programId = routerProgramId || selectedProgramId;
    const orgUnitId = routerOrgUnitId || selectedOrgUnitId;
    const enrollmentId = routerEnrollmentId || selectedEnrollmentId;
    const teiId = routerTeiId || selectedTeiId;
    const trackedEntityTypeId = routerTet || selectedEnrollmentId;
    const enrollmentsAsOptions = buildEnrollmentsAsOptions(enrollmentPage.enrollments, programId);

    return {
        selectedProgramId: programId,
        selectedOrgUnitId: orgUnitId,
        selectedEnrollmentId: enrollmentId,
        selectedCategories: categoriesMeta,
        selectedOrgUnit: orgUnitId ? organisationUnits[orgUnitId] : null,
        currentPage: pathname.substring(1),
        selectedTeiName: enrollmentPage.trackedEntityInstanceDisplayName,
        enrollmentsAsOptions,
        enrollmentLockedSelectReady: enrollmentPage.enrollments && enrollmentPage.enrollments.length,
    };
};

// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, () => ({}))(QuickSelector);
