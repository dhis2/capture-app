import * as React from 'react';

export const withGotoInterface = () =>
    (InnerComponent: React.ComponentType<any>) =>
        class GotoFieldInterface extends React.Component<any> {
            gotoInstance: any;

            goto() {
                if (this.gotoInstance) {
                    this.gotoInstance.scrollIntoView({ block: 'start' });
                }
            }

            render() {
                return (
                    <div
                        ref={(gotoInstance) => { this.gotoInstance = gotoInstance; }}
                        style={{ scrollMarginTop: '80px' }}
                    >
                        <InnerComponent
                            {...this.props}
                        />
                    </div>
                );
            }
        };
