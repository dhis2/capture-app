// @flow
import * as React from 'react';
import { CancelButton } from './CancelButton.container';

type Props = {
    id: string,
    onCancel: () => void,
    cancelButtonIsDisabled?: boolean,
    cancelButtonRef?: ?Function,
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
                            disabled={cancelButtonIsDisabled}
                        />
                    }
                    {...passOnProps}
                />
            );
        }
    };


export const withCancelButton = (optionsFn?: ?OptionsFn) =>
    (InnerComponent: React.ComponentType<any>) =>

        getCancelButton(InnerComponent, optionsFn);
