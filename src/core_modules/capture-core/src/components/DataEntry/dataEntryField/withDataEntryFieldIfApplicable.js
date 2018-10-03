// @flow
import * as React from 'react';
import withDataEntryField from './withDataEntryField';

type Props = {
};

type SettingsFn = (props: Object) => ?Object;


const getDataEntryFieldIfApplicable = (settingsFn: SettingsFn, InnerComponent: React.ComponentType<any>) =>
    class DataEntryFieldIfApplicableHOC extends React.Component<Props> {
        innerInstance: any;
        Component: React.ComponentType<any>;
        constructor(props: Props) {
            super(props);
            const settings = settingsFn(this.props);
            if (settings) {
                // $FlowSuppress
                this.Component = withDataEntryField(settingsFn)(InnerComponent);
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

export default (settingsFn: SettingsFn) =>
    (InnerComponent: React.ComponentType<any>) =>
        getDataEntryFieldIfApplicable(settingsFn, InnerComponent);
