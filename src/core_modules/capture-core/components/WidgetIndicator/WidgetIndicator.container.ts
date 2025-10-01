import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { WidgetIndicator } from './WidgetIndicator.component';

const mapStateToProps = (state: any, props: any) => ({
    indicators: [
        ...(state.rulesEffectsIndicators[props.dataEntryKey]?.displayTexts || []),
        ...(state.rulesEffectsIndicators[props.dataEntryKey]?.displayKeyValuePairs || []),
    ],
    emptyText: i18n.t('No indicators to display'),
});

export const IndicatorsSection = connect(mapStateToProps, () => ({}))(WidgetIndicator);

