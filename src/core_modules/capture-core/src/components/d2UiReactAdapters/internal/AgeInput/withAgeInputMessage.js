// @flow
import * as React from 'react';

type Props = {
    onChange: (value: any) => void,
    message?: ?any,
    value: any,
    defaultClasses?: any,
};

type State = {
    value: any,
};
export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        class AgeInputMessage extends React.Component<Props, State> {
            render() {
                const { message, defaultClasses, ...passOnProps } = this.props;
                const classes = defaultClasses || {};
                return (
                    <div>
                        <InnerComponent
                            {...passOnProps}
                        />
                        {message && <div className={classes[message.className]}>{message.message}</div>}
                    </div>

                );
            }
        };