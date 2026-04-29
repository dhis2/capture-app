import * as React from 'react';

export const withGotoInterface = () =>
    (InnerComponent: React.ComponentType<any>) =>
        class GotoFieldInterface extends React.Component<any> {
            gotoInstance: any;

            goto() {
                if (this.gotoInstance) {
                    this.gotoInstance.scrollIntoView({ block: 'center' });
                }
            }

            render() {
                return (
                    <div
                        ref={(gotoInstance) => { this.gotoInstance = gotoInstance; }}
                    >
                        <InnerComponent
                            {...this.props}
                        />
                    </div>
                );
            }
        };
