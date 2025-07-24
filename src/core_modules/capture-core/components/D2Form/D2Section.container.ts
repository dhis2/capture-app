import { connect } from 'react-redux';
import { D2Section } from './D2Section.component';
import type { Section as MetaDataSection } from '../../metaData';
import { withApiUtils } from '../../HOC';

const mapStateToProps = (state: any, props: { sectionMetaData: MetaDataSection, formId: string }) => {
    const fieldsHiddenByRules = state.rulesEffectsHiddenFields[props.formId];
    if (fieldsHiddenByRules) {
        const visibleFields = Array.from(props.sectionMetaData.elements.keys())
            .filter((id: any) => !fieldsHiddenByRules[id]);

        return { isHidden: !visibleFields.length };
    }

    return { isHidden: !props.sectionMetaData.elements.size };
};

const mapDispatchToProps = () => ({});

export const D2SectionContainer = connect(mapStateToProps, mapDispatchToProps)(withApiUtils(D2Section));
