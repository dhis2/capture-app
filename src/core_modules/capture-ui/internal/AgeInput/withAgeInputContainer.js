// @flow
import * as React from 'react';
import defaultClasses from './ageInput.module.css';

type Props = {
    message?: ?any,
    value: any,
    classes?: any,
};

type State = {
    value: any,
};
export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        class AgeInputContainer extends React.Component<Props, State> {
            render() {
                const { message, ...passOnProps } = this.props;
                const classes = this.props.classes;
                const ageInputContainerClass =
                    (classes && classes.ageInputContainer)
                    || defaultClasses.ageInputContainer;
                return (
                    <div className={ageInputContainerClass}>
                        <InnerComponent
                            {...passOnProps}
                        />
                        {message && <div className={defaultClasses[message.className]}>{message.message}</div>}
                    </div>

                );
            }
        };
