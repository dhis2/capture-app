import * as React from 'react';
import { CancelButton } from './CancelButton.container';

type Props = {
    id: string;
    onCancel: () => void;
    cancelButtonIsDisabled?: boolean;
    cancelButtonRef?: (...args: any[]) => void;
};

type Options = {
    color?: string;
};

type OptionsFn = (props: Props) => Options;

const getCancelButton = (InnerComponent: React.ComponentType<any>, optionsFn?: OptionsFn | null) =>
    class CancelButtonHOC extends React.Component<Props> {
        getWrappedInstance = () => this.innerInstance;

        innerInstance: any;

        render() {
            const { onCancel, cancelButtonIsDisabled, cancelButtonRef, ...passOnProps } = this.props;
            const options = (optionsFn && optionsFn(this.props)) || {};

            return (
                // $FlowFixMe[cannot-spread-inexact] automated comment
                <InnerComponent
                    innerRef={(innerInstance) => { this.innerInstance = innerInstance; }}
                    cancelButton={
                        <CancelButton
                            id={this.props.id}
                            onCancel={onCancel}
                            options={options}
                            disabled={Boolean(cancelButtonIsDisabled)}
                        />
                    }
                    {...passOnProps}
                />
            );
        }
    };


export const withCancelButton = (optionsFn?: OptionsFn | null) =>
    (InnerComponent: React.ComponentType<any>) =>

        getCancelButton(InnerComponent, optionsFn);
