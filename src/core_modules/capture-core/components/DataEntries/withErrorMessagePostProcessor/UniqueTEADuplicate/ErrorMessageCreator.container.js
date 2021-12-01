// @flow
import { connect } from 'react-redux';
import { makeTETSelector, makeAttributeNameSelector } from './ErrorMessageCreator.selectors';
import { UniqueTEADuplicate } from './ErrorMessageCreator.component';

const makeMapStateToProps = () => {
    const TETSelector = makeTETSelector();
    const attributeNameSelector = makeAttributeNameSelector();
    const mapStateToProps = (state: ReduxState, props: Object) => {
        const trackedEntityType = TETSelector(state, props);
        const attributeName = attributeNameSelector(state, props, trackedEntityType);

        return {
            trackedEntityType,
            attributeName,
        };
    };
    // $FlowFixMe
    return mapStateToProps;
};

// $FlowFixMe
export const ErrorMessageCreator = connect(makeMapStateToProps, () => ({}))(UniqueTEADuplicate);
