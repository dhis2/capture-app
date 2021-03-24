// @flow
import { type ComponentType } from 'react';
import { connect } from 'react-redux';
import QuickSelectorComponent from './QuickSelector.component';
import { deriveUrlQueries } from '../../../utils/url';
import type { OwnProps } from './QuickSelector.types';

const mapStateToProps = (state: Object) => {
    const { orgUnitId, programId } = deriveUrlQueries(state);
    const {
        currentSelections: { categoriesMeta },
        organisationUnits,
    } = state;

    return {
        selectedProgramId: programId,
        selectedOrgUnitId: orgUnitId,
        selectedCategories: categoriesMeta,
        selectedOrgUnit: orgUnitId ? organisationUnits[orgUnitId] : null,
    };
};

export const QuickSelector: ComponentType<OwnProps> = connect(mapStateToProps, () => ({}))(QuickSelectorComponent);
