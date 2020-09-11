// @flow
import { connect } from 'react-redux';
import D2Section from './D2Section.component';
import type { Section as MetaDataSection } from '../../metaData';

const mapStateToProps = (state: Object, props: { sectionMetaData: MetaDataSection, formId: string }) => ({
    isHidden: !!(
        state.rulesEffectsHiddenSections[props.formId] &&
        state.rulesEffectsHiddenSections[props.formId][props.sectionMetaData.id]
    ),
});

const mapDispatchToProps = () => ({});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, mapDispatchToProps)(D2Section);
