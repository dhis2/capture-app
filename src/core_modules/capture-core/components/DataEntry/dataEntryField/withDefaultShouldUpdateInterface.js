// @flow
import * as React from 'react';

type Props = {
    value: any,
    touched?: ?boolean,
    validationAttempted?: ?boolean,
    errorText?: ?string,
};

export const withDefaultShouldUpdateInterface = () =>
    (InnerComponent: React.ComponentType<any>) =>
        class ShouldFieldUpdateInterface extends React.Component<Props> {
            shouldComponentUpdate(nextProps: Props) {
                const pureCheck = ['value', 'touched', 'validationAttempted', 'validationError'];
                // $FlowFixMe[prop-missing] automated comment
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
