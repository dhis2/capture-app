// @flow
import { connect } from 'react-redux';
import WarningsSection from './WarningsSection.component';
import { makeGetSearchGroupWarning, makeGetWarningMessages } from './warningsSection.selectors';
import { makeGetVisibleMessages } from '../ErrorsSection/messageSection.selectors';

const makeStateToProps = () => {
    const getSearchGroupWarning = makeGetSearchGroupWarning();
    const getWarningMessages = makeGetWarningMessages();
    const getVisibleMessages = makeGetVisibleMessages();

    const mapStateToProps = (state: ReduxState, props: Object) => {
        const key = props.dataEntryKey;
        const messagesContainer = state.rulesEffectsGeneralWarnings[key];
        const showOnComplete = state.dataEntriesUI &&
        state.dataEntriesUI[key] &&
        state.dataEntriesUI[key].saveAttempted;

        const rulesWarnings = getVisibleMessages({
            messagesContainer,
            containerPropNameMain: 'warning',
            containerPropNameOnComplete: 'warningOnComplete',
            showOnComplete,
        });
        const searchGroupWarning = getSearchGroupWarning(state, props);
        return {
            warnings: getWarningMessages(searchGroupWarning, rulesWarnings),
        };
    };
    // $FlowFixMe[not-an-object] automated comment
    return mapStateToProps;
};

// $FlowFixMe[missing-annot] automated comment
export default connect(makeStateToProps, () => ({}))(WarningsSection);
