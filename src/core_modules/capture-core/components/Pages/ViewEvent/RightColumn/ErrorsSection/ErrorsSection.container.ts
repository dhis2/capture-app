import { connect } from 'react-redux';
import { ErrorsSectionComponent } from './ErrorsSection.component';
import { makeGetVisibleMessages } from './messageSection.selectors';

const makeStateToProps = () => {
    const getVisibleErrors = makeGetVisibleMessages();
    const mapStateToProps = (state: any, props: any) => {
        const messagesContainer = state.rulesEffectsGeneralErrors[props.dataEntryKey];
        return {
            errors: getVisibleErrors({
                messagesContainer,
                containerPropNameMain: 'error',
                containerPropNameOnComplete: 'errorOnComplete',
                showOnComplete: true,
            }),
        };
    };
    return mapStateToProps;
};

export const ErrorsSection = connect(makeStateToProps, () => ({}))(ErrorsSectionComponent);
