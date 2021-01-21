// @flow

import { connect } from 'react-redux';
import QuickSelector from './QuickSelector.component';

const mapStateToProps = (state: Object) => {
    const {
        organisationUnits,
        currentSelections: {
            programId: selectedProgramId,
            orgUnitId: selectedOrgUnitId,
            categoriesMeta,
        },
        router: {
            location: {
                query: {
                    programId: routerProgramId,
                    orgUnitId: routerOrgUnitId,
                },
                pathname,
            },
        },
    } = state;

    const programId = routerProgramId || selectedProgramId;
    const orgUnitId = routerOrgUnitId || selectedOrgUnitId;

    return {
        selectedProgramId: programId,
        selectedOrgUnitId: orgUnitId,
        selectedCategories: categoriesMeta,
        selectedOrgUnit: orgUnitId ? organisationUnits[orgUnitId] : null,
        currentPage: pathname.substring(1),
    };
};

// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, () => ({}))(QuickSelector);
