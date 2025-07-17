import * as React from 'react';

export const withDefaultShouldUpdateInterface = () =>
    (InnerComponent: React.ComponentType<any>) =>
        (class DefaultShouldUpdateInterface extends React.Component<any> {
            shouldComponentUpdate() {
                return true;
            }

            render() {
                return (
                    <InnerComponent
                        {...this.props}
                    />
                );
            }
        });
