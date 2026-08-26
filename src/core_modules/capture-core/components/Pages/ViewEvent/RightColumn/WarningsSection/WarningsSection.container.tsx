import { connect } from 'react-redux';
import { WarningsSectionComponent } from './WarningsSection.component';
import { makeGetVisibleMessages } from '../ErrorsSection/messageSection.selectors';

const makeStateToProps = () => {
    const getVisibleWarnings = makeGetVisibleMessages();
    const mapStateToProps = (state: any, props: any) => {
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
    return mapStateToProps;
};

export const WarningsSection = connect(makeStateToProps, () => ({}))(WarningsSectionComponent);
