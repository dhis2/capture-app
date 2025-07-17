import * as React from 'react';

type Props = {
    value: any,
    touched?: boolean | null,
    validationAttempted?: boolean | null,
    errorText?: string | null,
};

export const withDefaultShouldUpdateInterface = () =>
    (InnerComponent: React.ComponentType<any>) =>
        class ShouldFieldUpdateInterface extends React.Component<Props> {
            shouldComponentUpdate(nextProps: Props) {
                const pureCheck = ['value', 'touched', 'validationAttempted', 'validationError'];
                return pureCheck.some(propName => nextProps[propName] !== this.props[propName]);
            }

            render() {
                return (
                    <InnerComponent
                        {...this.props}
                    />
                );
            }
        };
