import { connect } from 'react-redux';
import { WidgetIndicatorComponent } from './WidgetIndicator.component';
import { IndicatorProps } from './WidgetIndicator.types';

const mapStateToProps = (state: any, props: IndicatorProps) => ({
    indicators: props.indicators || (props.dataEntryKey ? [
        ...(state.rulesEffectsIndicators[props.dataEntryKey]?.displayTexts || []),
        ...(state.rulesEffectsIndicators[props.dataEntryKey]?.displayKeyValuePairs || []),
    ] : []),
    indicatorEmptyText: props.indicatorEmptyText,
});

export const WidgetIndicator = connect(mapStateToProps)(WidgetIndicatorComponent);
