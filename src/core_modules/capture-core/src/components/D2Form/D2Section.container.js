// @flow
import { connect } from 'react-redux';
import D2Section from './D2Section.component';
import { updateSectionStatus } from './D2Section.actions';
import MetaDataSection from '../../metaData/RenderFoundation/Section';

const mapStateToProps = (state: Object, props: { sectionMetaData: MetaDataSection }) => ({
    isHidden: !!state.eventsRulesEffectsHiddenSections[props.sectionMetaData.id],
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateSectionStatus: (id: string, status: Object) => {
        dispatch(updateSectionStatus(id, status));
    },
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(D2Section);
