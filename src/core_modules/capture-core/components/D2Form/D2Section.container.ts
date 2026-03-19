import { connect } from 'react-redux';
import { D2Section } from './D2Section.component';
import { Section as MetaDataSection } from '../../metaData';
import { withApiUtils } from '../../HOC';

const mapStateToProps = (state: any, props: { sectionMetaData: MetaDataSection, formId: string }) => {
    const fieldsHiddenByRules = state.rulesEffectsHiddenFields[props.formId];
    if (fieldsHiddenByRules) {
        const visibleFields = Array.from(props.sectionMetaData.elements.keys())
            .filter((id: any) => !fieldsHiddenByRules[id]);

        return { isHidden: !visibleFields.length };
    }

    return {
        isHidden: !props.sectionMetaData.elements.size ||
            props.sectionMetaData.id === MetaDataSection.LEFTOVERS_SECTION_ID,
    };
};

const mapDispatchToProps = () => ({});

export const D2SectionContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { forwardRef: true })(withApiUtils(D2Section));
