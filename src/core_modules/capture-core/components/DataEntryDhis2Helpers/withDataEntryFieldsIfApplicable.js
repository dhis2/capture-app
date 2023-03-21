// @flow
import * as React from 'react';
import { withDataEntryFields } from './withDataEntryFields';

type Props = {

};

type Settings = {
    isApplicable: (props: Props) => boolean,
};

const getDataEntryFieldsIfApplicable = (settings: Settings, InnerComponent: React.ComponentType<any>) =>
    class DataEntryFieldIfApplicableHOC extends React.Component<Props> {
        Component: React.ComponentType<any>;
        constructor(props: Props) {
            super(props);
            const applicable = settings.isApplicable(this.props);
            if (applicable) {
                // $FlowFixMe
                this.Component = withDataEntryFields(settings)(InnerComponent);
            } else {
                this.Component = InnerComponent;
            }
        }

        render() {
            const Component = this.Component;
            return (
                <Component
                    {...this.props}
                />
            );
        }
    };

export const withDataEntryFieldsIfApplicable = (settings: Settings) =>
    (InnerComponent: React.ComponentType<any>) =>
        getDataEntryFieldsIfApplicable(settings, InnerComponent);
