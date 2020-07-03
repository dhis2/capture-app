// @flow
import { connect } from 'react-redux';
import ErrorsSection from '../../../../ViewEvent/RightColumn/ErrorsSection/ErrorsSection.component';
import { makeGetVisibleMessages } from '../../../../ViewEvent/RightColumn/ErrorsSection/messageSection.selectors';

const makeStateToProps = () => {
    const getVisibleErrors = makeGetVisibleMessages();
    const mapStateToProps = (state: ReduxState, props: Object) => {
        const key = props.dataEntryKey;
        const messagesContainer = state.rulesEffectsGeneralErrors[key];
        const showOnComplete = state.dataEntriesUI &&
        state.dataEntriesUI[key] &&
        state.dataEntriesUI[key].saveAttempted;

        return {
            errors: getVisibleErrors({
                messagesContainer,
                containerPropNameMain: 'error',
                containerPropNameOnComplete: 'errorOnComplete',
                showOnComplete,
            }),
        };
    };
    // $FlowFixMe[not-an-object] automated comment
    return mapStateToProps;
};
// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export default connect(makeStateToProps, () => ({}))(ErrorsSection);
