// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import ProgressButton from '../Buttons/ProgressButton.component';
import getDataEntryKey from './common/getDataEntryKey';

type Props = {
    finalInProgress: boolean,
    onCancel: () => void,
};

type Options = {
    color?: ?string,
};

type OptionsFn = (props: Props) => Options;

const getCancelButton = (InnerComponent: React.ComponentType<any>, optionsFn?: ?OptionsFn) =>
    class CancelButtonHOC extends React.Component<Props> {
        innerInstance: any;

        getWrappedInstance = () => this.innerInstance;


        render() {
            const { finalInProgress, onCancel, ...passOnProps } = this.props;
            const options = (optionsFn && optionsFn(this.props)) || {};

            return (
                <InnerComponent
                    ref={(innerInstance) => { this.innerInstance = innerInstance; }}
                    cancelButton={
                        <ProgressButton
                            variant="text"
                            onClick={onCancel}
                            color={options.color || 'primary'}
                            inProgress={finalInProgress}
                        >
                            { i18n.t('Cancel') }
                        </ProgressButton>
                    }
                    {...passOnProps}
                />
            );
        }
    };

const mapStateToProps = (state: ReduxState, props: { id: string }) => {
    const itemId = state.dataEntries && state.dataEntries[props.id] && state.dataEntries[props.id].itemId;
    const key = getDataEntryKey(props.id, itemId);
    return {
        finalInProgress: !!(state.dataEntriesUI[key] && state.dataEntriesUI[key].finalInProgress),
    };
};

const mapDispatchToProps = () => ({});

export default (optionsFn?: ?OptionsFn) =>
    (InnerComponent: React.ComponentType<any>) =>
        // $FlowSuppress
        connect(
            mapStateToProps, mapDispatchToProps, null, { withRef: true })(
            getCancelButton(InnerComponent, optionsFn));
