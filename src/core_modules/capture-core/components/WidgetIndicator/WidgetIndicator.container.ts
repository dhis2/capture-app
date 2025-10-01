import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { WidgetIndicator } from './WidgetIndicator.component';

const mapStateToProps = (state: any, props: any) => ({
    indicators: [
        ...(state.rulesEffectsIndicators[props.dataEntryKey]?.displayTexts || []),
        ...(state.rulesEffectsIndicators[props.dataEntryKey]?.displayKeyValuePairs || []),
    ],
    emptyText: i18n.t('No indicator output for this enrollment yet'),
});

export const IndicatorsSection = connect(mapStateToProps, () => ({}))(WidgetIndicator);

