import * as React from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { useHideWidgetByRuleLocations } from 'capture-core/hooks';
import { getDataEntryKey } from '../common/getDataEntryKey';
import { withDataEntryOutput } from './withDataEntryOutput';
import { WidgetFeedback } from '../../WidgetFeedback';
import { makeProgramRulesSelector } from './dataEntryOutput.selectors';

type Props = {
    dataEntryKey?: string;
    programRules?: Array<any>;
};

const FeedbackOutputWrapper = (props: Props) => {
    const { dataEntryKey, programRules } = props;

    const hideWidgets = useHideWidgetByRuleLocations(programRules || []);

    if (hideWidgets.feedback) {
        return null;
    }

    return (
        <WidgetFeedback
            dataEntryKey={dataEntryKey}
            feedbackEmptyText={i18n.t('No feedback for this event yet')}
        />
    );
};

const makeMapStateToProps = () => {
    const programRulesSelector = makeProgramRulesSelector();

    return (state: any, props: any) => {
        const itemId = state.dataEntries[props.id].itemId;
        const dataEntryKey = getDataEntryKey(props.id, itemId);
        const programRules = programRulesSelector(state);

        return {
            dataEntryKey,
            programRules,
        };
    };
};

const mapDispatchToProps = () => ({});

export const withFeedbackOutput = () =>
    (InnerComponent: React.ComponentType<any>) =>
        withDataEntryOutput()(
            InnerComponent,
            connect(makeMapStateToProps, mapDispatchToProps)(FeedbackOutputWrapper));
