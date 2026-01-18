import * as React from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { getDataEntryKey } from '../common/getDataEntryKey';
import { withDataEntryOutput } from './withDataEntryOutput';
import {
    WidgetFeedback,
    type FilteredFeedbackText, type FilteredFeedbackKeyValue } from '../../WidgetFeedback';

type Props = {
    feedbackItems: {
        displayTexts: Array<FilteredFeedbackText>;
        displayKeyValuePairs: Array<FilteredFeedbackKeyValue>;
    };
};

const getFeedbackOutput = () =>
    class FeedbackOutputBuilder extends React.Component<Props> {
        getItems = () => {
            const { feedbackItems } = this.props;
            const displayTexts = feedbackItems?.displayTexts || [];
            const displayKeyValuePairs = feedbackItems?.displayKeyValuePairs || [];
            return [...displayTexts, ...displayKeyValuePairs];
        }

        render = () => {
            const feedback = this.getItems();
            return (
                <WidgetFeedback feedback={feedback} feedbackEmptyText={i18n.t('No feedback for this event yet')} />
            );
        }
    };

const mapStateToProps = (state: any, props: any) => {
    const itemId = state.dataEntries[props.id].itemId;
    const key = getDataEntryKey(props.id, itemId);
    return {
        feedbackItems: state.rulesEffectsFeedback && state.rulesEffectsFeedback[key] ?
            state.rulesEffectsFeedback[key] : null,
    };
};

const mapDispatchToProps = () => ({});

export const withFeedbackOutput = () =>
    (InnerComponent: React.ComponentType<any>) =>
        withDataEntryOutput()(
            InnerComponent,
            connect(mapStateToProps, mapDispatchToProps)(getFeedbackOutput()));
