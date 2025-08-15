import * as React from 'react';
import { withDataEntryField } from './withDataEntryField';
import type { Settings as BaseSettings } from './withDataEntryField.types';

type Props = Record<string, any>;

type Settings = BaseSettings & {
    isApplicable: (props: Props) => boolean;
};

const getDataEntryFieldIfApplicable = (settings: Settings, InnerComponent: React.ComponentType<any>) =>
    class DataEntryFieldIfApplicableHOC extends React.Component<Props> {
        // eslint-disable-next-line react/sort-comp
        Component: React.ComponentType<any>;

        constructor(props: Props) {
            super(props);
            const applicable = settings.isApplicable(this.props);
            if (applicable) {
                this.Component = withDataEntryField(settings)(InnerComponent);
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

export const withDataEntryFieldIfApplicable = (settings: Settings) =>
    (InnerComponent: React.ComponentType<any>) =>
        getDataEntryFieldIfApplicable(settings, InnerComponent);
