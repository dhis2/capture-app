// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { getDataEntryKey } from '../common/getDataEntryKey';
import { withDataEntryOutput } from './withDataEntryOutput';
import { WidgetError } from '../../WidgetErrorAndWarning/WidgetError';


type Props = {
    errorItems: ?Array<any>,
    errorOnCompleteItems: ?Array<any>,
    saveAttempted: boolean,
};

const getErrorOutput = () =>
    class ErrorOutputBuilder extends React.Component<Props> {
        name: string;
        constructor(props) {
            super(props);
            this.name = 'ErrorOutputBuilder';
        }

        getVisibleErrorItems() {
            const { errorItems, errorOnCompleteItems, saveAttempted } = this.props;
            if (saveAttempted) {
                const errorItemsNoNull = errorItems || [];
                const errorOnCompleteItemsNoNull = errorOnCompleteItems || [];
                return [
                    ...errorItemsNoNull,
                    ...errorOnCompleteItemsNoNull,
                ];
            }

            return errorItems || [];
        }

        render = () => {
            const visibleItems = this.getVisibleErrorItems();
            return <WidgetError error={visibleItems} />;
        }
    };


const mapStateToProps = (state: ReduxState, props: any) => {
    const itemId = state.dataEntries[props.id].itemId;
    const key = getDataEntryKey(props.id, itemId);
    return {
        errorItems: state.rulesEffectsGeneralErrors[key] ?
            state.rulesEffectsGeneralErrors[key].error : null,
        errorOnCompleteItems: state.rulesEffectsGeneralErrors[key] ?
            state.rulesEffectsGeneralErrors[key].errorOnComplete : null,
    };
};

const mapDispatchToProps = () => ({});

export const withErrorOutput = () =>
    (InnerComponent: React.ComponentType<any>) =>
        withDataEntryOutput()(
            InnerComponent,
            connect(mapStateToProps, mapDispatchToProps)(getErrorOutput()));
