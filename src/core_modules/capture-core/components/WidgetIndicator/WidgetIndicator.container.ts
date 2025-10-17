import { connect } from 'react-redux';
import { WidgetIndicatorComponent } from './WidgetIndicator.component';
import { getDataEntryKey } from '../DataEntry/common/getDataEntryKey';

const mapStateToProps = (state: any, props: any) => {
    const entryId = props.id ?? props.dataEntryId;
    const itemId = state.dataEntries?.[entryId]?.itemId;
    const key = itemId ? getDataEntryKey(entryId, itemId) : null;

    console.log('key', key);

    const indicators = key
        ? [
            ...(state.rulesEffectsIndicators?.[key]?.displayTexts ?? []),
            ...(state.rulesEffectsIndicators?.[key]?.displayKeyValuePairs ?? []),
        ]
        : [];

    return {
        indicators,
        emptyText: props.indicatorEmptyText,
    };
};

export const WidgetIndicator = connect(mapStateToProps)(WidgetIndicatorComponent);
