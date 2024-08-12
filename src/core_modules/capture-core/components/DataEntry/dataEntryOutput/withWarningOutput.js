// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { getDataEntryKey } from '../common/getDataEntryKey';
import { withDataEntryOutput } from './withDataEntryOutput';
import { WidgetWarning } from '../../WidgetErrorAndWarning/WidgetWarning';


type Props = {
    warningItems: ?Array<any>,
    warningOnCompleteItems: ?Array<any>,
    saveAttempted: boolean,
};

const getWarningOutput = () =>
    class WarningOutputBuilder extends React.Component<Props> {
        getVisibleWarningItems() {
            const { warningItems, warningOnCompleteItems, saveAttempted } = this.props;
            if (saveAttempted) {
                const warningItemsNoNull = warningItems || [];
                const warningOnCompleteItemsNoNull = warningOnCompleteItems || [];
                return [
                    ...warningItemsNoNull,
                    ...warningOnCompleteItemsNoNull,
                ];
            }

            return warningItems || [];
        }

        render = () => {
            const visibleItems = this.getVisibleWarningItems();
            return <WidgetWarning warning={visibleItems} />;
        }
    };


const mapStateToProps = (state: ReduxState, props: any) => {
    const itemId = state.dataEntries[props.id].itemId;
    const key = getDataEntryKey(props.id, itemId);
    return {
        warningItems: state.rulesEffectsGeneralWarnings[key] ?
            state.rulesEffectsGeneralWarnings[key].warning : null,
        warningOnCompleteItems: state.rulesEffectsGeneralWarnings[key] ?
            state.rulesEffectsGeneralWarnings[key].warningOnComplete : null,
    };
};

const mapDispatchToProps = () => ({});

export const withWarningOutput = () =>
    (InnerComponent: React.ComponentType<any>) =>
        withDataEntryOutput()(
            InnerComponent,
            connect(mapStateToProps, mapDispatchToProps)(getWarningOutput()));
