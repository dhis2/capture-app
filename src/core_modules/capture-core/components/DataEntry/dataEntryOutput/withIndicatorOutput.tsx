import * as React from 'react';
import { connect } from 'react-redux';
import { useHideWidgetByRuleLocations } from '../../../hooks';
import { getDataEntryKey } from '../common/getDataEntryKey';
import { withDataEntryOutput } from './withDataEntryOutput';
import { WidgetIndicator } from '../../WidgetIndicator';
import { makeProgramRulesSelector } from './dataEntryOutput.selectors';
import { useTermLabel } from '../../../metaData';
import { customTerms } from '../../../utils/customTerms';

type Props = {
    dataEntryKey?: string;
    programRules?: Array<any>;
};

const IndicatorOutputWrapper = (props: Props) => {
    const { dataEntryKey, programRules } = props;
    const eventLabel = useTermLabel('event');

    const hideWidgets = useHideWidgetByRuleLocations(programRules || []);

    if (hideWidgets.indicator) {
        return null;
    }

    return (
        <WidgetIndicator
            dataEntryKey={dataEntryKey}
            indicatorEmptyText={customTerms.i18n.t('No indicator output for this {{eventLabel}} yet', { eventLabel })}
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

export const withIndicatorOutput = () =>
    (InnerComponent: React.ComponentType<any>) =>
        withDataEntryOutput()(
            InnerComponent,
            connect(makeMapStateToProps, mapDispatchToProps)(IndicatorOutputWrapper));
