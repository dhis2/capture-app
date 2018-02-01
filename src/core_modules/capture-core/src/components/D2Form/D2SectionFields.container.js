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
    onUpdateField: (containerId: string, elementId: string, value: any) => {
        dispatch(updateField(containerId, elementId, value));
    },
});

export default connect(makeMapStateToProps, mapDispatchToProps, null, { withRef: true })(D2SectionFields);
