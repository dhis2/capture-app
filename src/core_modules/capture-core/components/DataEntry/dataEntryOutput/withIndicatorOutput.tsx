import * as React from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { getDataEntryKey } from '../common/getDataEntryKey';
import { withDataEntryOutput } from './withDataEntryOutput';
import {
    WidgetIndicator,
    type FilteredIndicatorText,
    type FilteredIndicatorKeyValue,
} from '../../WidgetIndicator';

type Props = {
    indicatorItems: {
        displayTexts: Array<FilteredIndicatorText>;
        displayKeyValuePairs: Array<FilteredIndicatorKeyValue>;
    };
};

const getIndicatorOutput = () =>
    class IndicatorOutputBuilder extends React.Component<Props> {
        getItems = () => {
            const { indicatorItems } = this.props;
            const displayTexts = indicatorItems?.displayTexts || [];
            const displayKeyValuePairs = indicatorItems?.displayKeyValuePairs || [];
            return [...displayTexts, ...displayKeyValuePairs];
        }

        render = () => {
            const indicators = this.getItems();
            const hasItems = indicators.length > 0;
            return (
                <div>
                    {hasItems &&
                        <WidgetIndicator
                            indicators={indicators}
                            indicatorEmptyText={i18n.t('No indicator output for this event yet')}
                        />
                    }
                </div>

            );
        }
    };

const mapStateToProps = (state: any, props: any) => {
    const itemId = state.dataEntries[props.id].itemId;
    const key = getDataEntryKey(props.id, itemId);
    return {
        indicatorItems: state.rulesEffectsIndicators && state.rulesEffectsIndicators[key] ?
            state.rulesEffectsIndicators[key] : null,
    };
};

const mapDispatchToProps = () => ({});

export const withIndicatorOutput = () =>
    (InnerComponent: React.ComponentType<any>) =>
        withDataEntryOutput()(
            InnerComponent,
            connect(mapStateToProps, mapDispatchToProps)(getIndicatorOutput()));
