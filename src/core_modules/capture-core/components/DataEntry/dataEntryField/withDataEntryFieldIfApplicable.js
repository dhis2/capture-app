// @flow
import * as React from 'react';
import withDataEntryField from './withDataEntryField';

type Props = {

};

type Settings = {
    isApplicable: (props: Props) => boolean,
};

const getDataEntryFieldIfApplicable = (settings: Settings, InnerComponent: React.ComponentType<any>) =>
    class DataEntryFieldIfApplicableHOC extends React.Component<Props> {
        innerInstance: any;
        Component: React.ComponentType<any>;
        constructor(props: Props) {
            super(props);
            const applicable = settings.isApplicable(this.props);
            if (applicable) {
                // $FlowFixMe
                this.Component = withDataEntryField(settings)(InnerComponent);
            } else {
                this.Component = InnerComponent;
            }
        }
        getWrappedInstance() {
            return this.innerInstance;
        }

        render() {
            const Component = this.Component;
            return (
                <Component
                    ref={(innerInstance) => { this.innerInstance = innerInstance; }}
                    {...this.props}
                />
            );
        }
    };

export default (settings: Settings) =>
    (InnerComponent: React.ComponentType<any>) =>
        getDataEntryFieldIfApplicable(settings, InnerComponent);
