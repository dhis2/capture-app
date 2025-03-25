import * as React from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { getDataEntryKey } from '../common/getDataEntryKey';
import { withDataEntryOutput } from './withDataEntryOutput';
import { WidgetIndicator } from '../../WidgetIndicator';
import { FilteredText, FilteredKeyValue } from '../../WidgetFeedback';

interface Props {
    indicatorItems?: {
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
    rulesEffectsIndicators: {
        [key: string]: {
            displayTexts: Array<FilteredText>;
            displayKeyValuePairs: Array<FilteredKeyValue>;
        };
    };
}

const getIndicatorOutput = () => {
    // Using function component instead of class component to avoid TypeScript errors
    const IndicatorOutputComponent = (props: Props) => {
        const getItems = () => {
            const { indicatorItems } = props;
            const displayTexts = indicatorItems?.displayTexts || [];
            const displayKeyValuePairs = indicatorItems?.displayKeyValuePairs || [];
            return [...displayTexts, ...displayKeyValuePairs];
        };

        const indicators = getItems();
        const hasItems = indicators.length > 0;
        
        return (
            <div>
                {hasItems &&
                    <WidgetIndicator indicators={indicators} emptyText={i18n.t('No indicator output for this event yet')} />
                }
            </div>
        );
    };
    
    return IndicatorOutputComponent;
};

const mapStateToProps = (state: ReduxState, props: any) => {
    const itemId = state.dataEntries[props.id].itemId;
    const key = getDataEntryKey(props.id, itemId);
    return {
        indicatorItems: state.rulesEffectsIndicators && state.rulesEffectsIndicators[key] ?
            state.rulesEffectsIndicators[key] : null,
    };
};

const mapDispatchToProps = () => ({});

export const withIndicatorOutput = () =>
    (InnerComponent: React.ComponentType<any>) => {
        const ConnectedIndicatorOutput = connect(mapStateToProps, mapDispatchToProps)(getIndicatorOutput());
        return withDataEntryOutput()(InnerComponent, ConnectedIndicatorOutput);
    };
