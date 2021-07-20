// @flow

import { connect } from 'react-redux';
import { QuickSelectorComponent } from './QuickSelector.component';
import { convertValue } from '../../../converters/clientToView';
import { dataElementTypes } from '../../../metaData/DataElement';
import {
    resetEnrollmentSelection,
    resetTeiSelection,
    setEnrollmentSelection,
} from '../ScopeSelector.actions';
import { deriveUrlQueries } from '../../../utils/url';
import { getScopeInfo } from '../../../metaData';

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
        enrollmentPage: { enrollments, teiDisplayName, tetId },
    } = state;

    const enrollmentsAsOptions = buildEnrollmentsAsOptions(enrollments, programId);
    const { trackedEntityName } = getScopeInfo(tetId);

    const enrollmentLockedSelectReady = Array.isArray(enrollments);
    return {
        selectedProgramId: programId,
        selectedOrgUnitId: orgUnitId,
        selectedCategories: categoriesMeta,
        selectedOrgUnit: orgUnitId ? organisationUnits[orgUnitId] : null,
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
