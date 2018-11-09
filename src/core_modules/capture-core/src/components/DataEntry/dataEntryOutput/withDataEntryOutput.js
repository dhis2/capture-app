// @flow

import * as React from 'react';

type Props = {
    dataEntryOutputs: Array<React.Component<any>>
};

const getDataEntryOutput = (InnerComponent: React.ComponentType<any>, Output: React.ComponentType<any>) =>
    class DataEntryOutputBuilder extends React.Component<Props> {
        name: string;
        innerInstance: ?any;
        outputInstance: ?any;
        constructor(props: Props) {
            super(props);
            this.name = 'DataEntryOutputBuilder';
        }

        getWrappedInstance() {
            return this.innerInstance;
        }
        getOutputInstance() {
            return this.outputInstance;
        }
        getDataEntryOutputs = () => {
            const dataEntryOutputs = this.props.dataEntryOutputs;
            const output = this.getOutput(dataEntryOutputs ? dataEntryOutputs.length : 0);
            return dataEntryOutputs ? [...dataEntryOutputs, output] : [output];
        };
        getOutput = (key: any) =>
            (
                <div style={{ marginTop: 10 }} key={key}>
                    <Output
                        ref={(outputInstance) => { this.outputInstance = outputInstance; }}
                        key={key}
                        {...this.props}
                    />
                </div>
            )
        render = () => {
            const { dataEntryOutputs, ...passOnProps } = this.props;

            return (
                <div>
                    <InnerComponent
                        ref={(innerInstance) => { this.innerInstance = innerInstance; }}
                        dataEntryOutputs={this.getDataEntryOutputs()}
                        {...passOnProps}
                    />
                </div>
            );
        }
    };

export default () =>
    (InnerComponent: React.ComponentType<any>, Output: React.ComponentType<any>) =>
        getDataEntryOutput(InnerComponent, Output);
