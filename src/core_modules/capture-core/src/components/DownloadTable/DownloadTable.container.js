// @flow
import { connect } from 'react-redux';
import DownloadTable from './DownloadTable.component';
import { makeProgramAndStageContainerSelector, makeOrgUnitSelector } from './DownloadTable.selectors';

// TODO: Change programId to current programStageId
const makeMapStateToProps = () => {
    const programAndStageSelector = makeProgramAndStageContainerSelector();
    const orgUnitSelector = makeOrgUnitSelector();
    const mapStateToProps = (state: Object) => ({
        programAndStageContainer: programAndStageSelector(state),
        orgUnit: orgUnitSelector(state),
        selectedCategoryOptions: state.currentSelections.categories,
    });

    return mapStateToProps;
};

// $FlowSuppress
export default connect(makeMapStateToProps)(DownloadTable);
