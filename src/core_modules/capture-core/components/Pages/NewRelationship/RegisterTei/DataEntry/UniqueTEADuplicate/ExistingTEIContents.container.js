// @flow
import { connect } from 'react-redux';
import ExistingTEIContents from './ExistingTEIContents.component';
import {
  makeDataElementsSelector,
  makeGetClientValuesSelector,
} from './existingTEIContents.selectors';

const makeMapStateToProps = () => {
  const dataElementsSelector = makeDataElementsSelector();
  const clientValuesSelector = makeGetClientValuesSelector();
  const mapStateToProps = (state: ReduxState, props: Object) => {
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

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { programId, tetAttributesOnly, errorData, ...passOnOwnProps } = ownProps;
  // $FlowFixMe[not-an-object] automated comment
  return { ...passOnOwnProps, ...stateProps, ...dispatchProps };
};

// $FlowFixMe
export default connect(makeMapStateToProps, () => ({}), mergeProps)(ExistingTEIContents);
