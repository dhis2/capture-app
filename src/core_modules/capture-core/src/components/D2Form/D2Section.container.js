// @flow
import { connect } from 'react-redux';
import D2Section from './D2Section.component';
import MetaDataSection from '../../metaData/RenderFoundation/Section';

const mapStateToProps = (state: Object, props: { sectionMetaData: MetaDataSection }) => ({
    isHidden: !!state.rulesEffectsHiddenSections[props.sectionMetaData.id],
});

// $FlowSuppress
export default connect(mapStateToProps, null, null, { withRef: true })(D2Section);
