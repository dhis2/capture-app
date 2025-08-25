import { connect } from 'react-redux';
import { ExistingTEIContentsComponent } from './ExistingTEIContents.component';
import { makeDataElementsSelector, makeGetClientValuesSelector } from './existingTeiContents.selectors';

const makeMapStateToProps = () => {
    const dataElementsSelector = makeDataElementsSelector();
    const clientValuesSelector = makeGetClientValuesSelector();
    const mapStateToProps = (state: any, props: any) => {
        const dataElements = dataElementsSelector(props);
        const attributeValues = clientValuesSelector(props, dataElements);
        return {
            programId: state.newRelationshipRegisterTei.programId,
            dataElements,
            attributeValues,
        };
    };
    return mapStateToProps;
};

const mergeProps = (stateProps: any, dispatchProps: any, ownProps: any) => {
    const { programId, tetAttributesOnly, errorData, ...passOnOwnProps } = ownProps;
    return {
        ...passOnOwnProps,
        ...stateProps,
        ...dispatchProps,
        teiId: errorData.id,
    };
};

export const ExistingTEIContents = connect(makeMapStateToProps, () => ({}), mergeProps)(ExistingTEIContentsComponent as any);
