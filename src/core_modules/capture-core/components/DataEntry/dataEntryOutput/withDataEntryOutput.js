// @flow

import * as React from 'react';

type Props = {
    dataEntryOutputs: Array<React.Component<any>>,
};

const getDataEntryOutput = (InnerComponent: React.ComponentType<any>, Output: React.ComponentType<any>) =>
    class DataEntryOutputBuilder extends React.Component<Props> {
        name: string;
        innerInstance: ?any;
        constructor(props: Props) {
            super(props);
            this.name = 'DataEntryOutputBuilder';
        }

        getDataEntryOutputs = () => {
            const dataEntryOutputs = this.props.dataEntryOutputs;
            const output = this.getOutput(dataEntryOutputs ? dataEntryOutputs.length : 0);
            return dataEntryOutputs ? [...dataEntryOutputs, output] : [output];
        };
        getOutput = (key: any) => (
            <div key={key}>
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <Output
                    key={key}
                    {...this.props}
                />
            </div>
        )

        render = () => {
            const { dataEntryOutputs, ...passOnProps } = this.props;

            return (
                <div>
                    {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                    <InnerComponent
                        ref={(innerInstance) => { this.innerInstance = innerInstance; }}
                        dataEntryOutputs={this.getDataEntryOutputs()}
                        {...passOnProps}
                    />
                </div>
            );
        }
    };

export const withDataEntryOutput = () =>
    (InnerComponent: React.ComponentType<any>, Output: React.ComponentType<any>) =>
        getDataEntryOutput(InnerComponent, Output);
