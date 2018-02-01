// @flow
import * as React from 'react';

type Props = {
    value: any,
    touched?: ?boolean,
    validationAttempted?: ?boolean,
    errorText?: ?string,
};

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        class ShuoldFieldUpdateInterface extends React.Component<Props> {
            shouldComponentUpdate(nextProps: Props) {
                const pureCheck = ['value', 'touched', 'validationAttempted', 'errorText'];
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
