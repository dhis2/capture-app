// @flow
import { connect } from 'react-redux';
import D2SectionFields from './D2SectionFields.component';
import { updateField } from './D2SectionFields.actions';
import { makeGetSectionValues } from './D2SectionFields.selectors';

const makeMapStateToProps = () => {
    const getSectionValues = makeGetSectionValues();

    const mapStateToProps = (state: Object, props: { getContainerId: () => string }) => ({
        values: getSectionValues(state, props),
    });
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateField: (value: any, uiState: Object, elementId: string, sectionId: string, formId: string) => {
        dispatch(updateField(value, uiState, elementId, sectionId, formId));
    },
});

export default connect(makeMapStateToProps, mapDispatchToProps, null, { withRef: true })(D2SectionFields);
