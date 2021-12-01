// @flow
import { connect } from 'react-redux';
import { makeGetVisibleMessages } from '../ErrorsSection/messageSection.selectors';
import { WarningsSectionComponent } from './WarningsSection.component';

const makeStateToProps = () => {
    const getVisibleWarnings = makeGetVisibleMessages();
    const mapStateToProps = (state: ReduxState, props: Object) => {
        const messagesContainer = state.rulesEffectsGeneralWarnings[props.dataEntryKey];
        return {
            warnings: getVisibleWarnings({
                messagesContainer,
                containerPropNameMain: 'warning',
                containerPropNameOnComplete: 'warningOnComplete',
                showOnComplete: true,
            }),
        };
    };
    // $FlowFixMe[not-an-object] automated comment
    return mapStateToProps;
};

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export const WarningsSection = connect(makeStateToProps, () => ({}))(WarningsSectionComponent);
