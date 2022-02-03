// @flow

import { connect } from 'react-redux';
import { QuickSelectorComponent } from './QuickSelector.component';
import { convertValue } from '../../../converters/clientToView';
import { dataElementTypes } from '../../../metaData/DataElement';
import {
    resetEnrollmentSelection,
    resetTeiSelection,
    setEnrollmentSelection,
} from '../LockedSelector.actions';
import { getLocationPathname, getUrlQueries } from '../../../utils/url';
import { getScopeInfo } from '../../../metaData';

const buildEnrollmentsAsOptions = (enrollments = [], selectedProgramId) =>
    enrollments
        .filter(({ program }) => program === selectedProgramId)
        .map(({ enrollmentDate, enrollment }) => (
            {
                label: convertValue(enrollmentDate, dataElementTypes.DATETIME),
                value: enrollment,
            }
        ));

const mapStateToProps = (state: Object) => {
    const { orgUnitId: urlOrgUnitId, programId: urlProgramId, enrollmentId } = getUrlQueries();
    const pathname = getLocationPathname();
    // TODO - Remove the currentSelections & pathname link
    const {
        currentSelections: { programId: stateProgramId, orgUnitId: stateOrgUnit, categoriesMeta },
        organisationUnits,
        enrollmentPage: { enrollments, teiDisplayName, tetId },
    } = state;

    const selectedOrgUnitId = urlOrgUnitId || stateOrgUnit;
    const selectedProgramId = urlProgramId || stateProgramId;

    const enrollmentsAsOptions = buildEnrollmentsAsOptions(enrollments, selectedProgramId);
    const { trackedEntityName } = getScopeInfo(tetId);

    const enrollmentLockedSelectReady = Array.isArray(enrollments);
    return {
        selectedProgramId,
        selectedOrgUnitId,
        selectedCategories: categoriesMeta,
        selectedOrgUnit: selectedOrgUnitId ? organisationUnits[selectedOrgUnitId] : null,
        currentPage: pathname.substring(1),
        selectedTeiName: teiDisplayName,
        selectedTetName: trackedEntityName,
        selectedEnrollmentId: enrollmentId,
        enrollmentsAsOptions,
        enrollmentLockedSelectReady,
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
export const QuickSelector = connect(mapStateToProps, mapDispatchToProps)(QuickSelectorComponent);
