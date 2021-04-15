// @flow
import { connect } from 'react-redux';
import { WarningsSectionComponent } from '../../Pages/ViewEvent/RightColumn/WarningsSection/WarningsSection.component';
import { makeGetVisibleMessages } from '../../Pages/ViewEvent/RightColumn/ErrorsSection/messageSection.selectors';

const makeStateToProps = () => {
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

        return {
            warnings: rulesWarnings,
        };
    };
    // $FlowFixMe[not-an-object] automated comment
    return mapStateToProps;
};

// $FlowFixMe[missing-annot] automated comment
export const WarningsSection = connect(makeStateToProps, () => ({}))(WarningsSectionComponent);
