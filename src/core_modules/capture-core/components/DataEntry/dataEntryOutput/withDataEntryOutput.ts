import * as React from 'react';
import type { PlainProps } from './withDataEntryOutput.types';

const getDataEntryOutput = (InnerComponent: React.ComponentType<any>, Output: React.ComponentType<any>) =>
    class DataEntryOutputBuilder extends React.Component<PlainProps> {
        name: string;
        innerInstance: any;
        
        constructor(props: PlainProps) {
            super(props);
            this.name = 'DataEntryOutputBuilder';
        }

        addOutput = (dataEntryOutputs: Array<React.Component<any>>) => {
            const output = this.getOutput(dataEntryOutputs ? dataEntryOutputs.length : 0);
            return dataEntryOutputs ? [...dataEntryOutputs, output] : [output];
        };
        
        getOutput = (key: any) => {
            return React.createElement('div', { key }, 
                React.createElement(Output, {
                    ...this.props,
                    innerInstance: this.innerInstance
                })
            );
        };

        render() {
            const { dataEntryOutputs, ...passOnProps } = this.props;
            return React.createElement(InnerComponent, {
                ref: (innerInstance: any) => { this.innerInstance = innerInstance; },
                dataEntryOutputs: this.addOutput(dataEntryOutputs),
                ...passOnProps
            });
        }
    };

export const withDataEntryOutput = () =>
    (InnerComponent: React.ComponentType<any>, Output: React.ComponentType<any>) =>
        getDataEntryOutput(InnerComponent, Output);
