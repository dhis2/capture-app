import React, { forwardRef } from 'react';

export const withGotoInterface = () =>
    (InnerComponent: React.ComponentType<any>) => {
        class GotoFieldInterface extends React.Component<any> {
            gotoInstance: any;

            goto() {
                if (this.gotoInstance) {
                    this.gotoInstance.scrollIntoView({ block: 'center' });
                }
            }

            render() {
                const { forwardedRef, ...rest } = this.props;
                return (
                    <div
                        ref={(gotoInstance) => { this.gotoInstance = gotoInstance; }}
                    >
                        <InnerComponent
                            ref={forwardedRef}
                            {...rest}
                        />
                    </div>
                );
            }
        }

        return forwardRef<any, any>((props, ref) => (
            <GotoFieldInterface {...props} forwardedRef={ref} />
        ));
    };
