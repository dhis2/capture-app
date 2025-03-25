import * as React from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { getDataEntryKey } from '../common/getDataEntryKey';
import { withDataEntryOutput } from './withDataEntryOutput';
import { WidgetFeedback } from '../../WidgetFeedback';
import { FilteredText, FilteredKeyValue } from '../../WidgetFeedback';

interface Props {
    feedbackItems?: {
        displayTexts: Array<FilteredText>;
        displayKeyValuePairs: Array<FilteredKeyValue>;
    } | null;
}

interface ReduxState {
    dataEntries: {
        [id: string]: {
            itemId: string;
        };
    };
    rulesEffectsFeedback: {
        [key: string]: {
            displayTexts: Array<FilteredText>;
            displayKeyValuePairs: Array<FilteredKeyValue>;
        };
    };
}

const getFeedbackOutput = () => {
    // Using function component instead of class component to avoid TypeScript errors
    const FeedbackOutputComponent = (props: Props) => {
        const getItems = () => {
            const { feedbackItems } = props;
            const displayTexts = feedbackItems?.displayTexts || [];
            const displayKeyValuePairs = feedbackItems?.displayKeyValuePairs || [];
            return [...displayTexts, ...displayKeyValuePairs];
        };

        const feedback = getItems();
        const hasItems = feedback.length > 0;
        
        return (
            <div>
                {hasItems &&
                    <WidgetFeedback feedback={feedback} emptyText={i18n.t('No feedback for this event yet')} />
                }
            </div>
        );
    };
    
    return FeedbackOutputComponent;
};

const mapStateToProps = (state: ReduxState, props: any) => {
    const itemId = state.dataEntries[props.id].itemId;
    const key = getDataEntryKey(props.id, itemId);
    return {
        feedbackItems: state.rulesEffectsFeedback && state.rulesEffectsFeedback[key] ?
            state.rulesEffectsFeedback[key] : null,
    };
};

const mapDispatchToProps = () => ({});

export const withFeedbackOutput = () =>
    (InnerComponent: React.ComponentType<any>) => {
        const ConnectedFeedbackOutput = connect(mapStateToProps, mapDispatchToProps)(getFeedbackOutput());
        return withDataEntryOutput()(InnerComponent, ConnectedFeedbackOutput);
    };
