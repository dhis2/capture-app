import { connect } from 'react-redux';
import { ErrorsSectionComponent } from '../../Pages/ViewEvent/RightColumn/ErrorsSection/ErrorsSection.component';
import { makeGetVisibleMessages } from '../../Pages/ViewEvent/RightColumn/ErrorsSection/messageSection.selectors';

const makeStateToProps = () => {
    const getVisibleErrors = makeGetVisibleMessages();
    const mapStateToProps = (state: any, props: { dataEntryKey: string }) => {
        const key = props.dataEntryKey;
        const messagesContainer = state.rulesEffectsGeneralErrors[key];
        const showOnComplete = state.dataEntriesUI?.[key]?.saveAttempted;

        return {
            errors: getVisibleErrors({
                messagesContainer,
                containerPropNameMain: 'error',
                containerPropNameOnComplete: 'errorOnComplete',
                showOnComplete,
            }),
        };
    };
    return mapStateToProps;
};

export const ErrorsSection = connect(makeStateToProps, () => ({}))(ErrorsSectionComponent);
