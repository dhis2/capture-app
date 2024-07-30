// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { getDataEntryKey } from '../common/getDataEntryKey';
import { withDataEntryOutput } from './withDataEntryOutput';
import { WidgetFeedback } from '../../WidgetFeedback';
import type { FilteredText, FilteredKeyValue } from '../../WidgetFeedback';

type Props = {
    feedbackItems: {
        displayTexts: Array<FilteredText>,
        displayKeyValuePairs: Array<FilteredKeyValue>,
    },
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
            const hasItems = feedback.length > 0;
            return (
                <div>
                    {hasItems &&
                        <WidgetFeedback feedback={feedback} emptyText={i18n.t('No feedback for this event yet')} />
                    }
                </div>
            );
        }
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
    (InnerComponent: React.ComponentType<any>) =>

        withDataEntryOutput()(
            InnerComponent,
            connect(mapStateToProps, mapDispatchToProps)(getFeedbackOutput()));
