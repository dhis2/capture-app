import { connect } from 'react-redux';
import { WidgetIndicatorComponent } from './WidgetIndicator.component';

const mapStateToProps = (state: any, props: any) => ({
    indicators: [
        ...(state.rulesEffectsIndicators[props.dataEntryKey]?.displayTexts || []),
        ...(state.rulesEffectsIndicators[props.dataEntryKey]?.displayKeyValuePairs || []),
    ],
    emptyText: props.indicatorEmptyText,
});

export const WidgetIndicator = connect(mapStateToProps)(WidgetIndicatorComponent);
