// @flow

import { connect } from 'react-redux';
import QuickSelector from './QuickSelector.component';
import { deriveUrlQueries } from '../../../utils/url';

const mapStateToProps = (state: Object) => {
    const { orgUnitId, programId } = deriveUrlQueries(state);
    const {
        router: { location: { pathname } },
        currentSelections: { categoriesMeta },
        organisationUnits,
    } = state;

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
