// @flow
import * as React from 'react';
import isFunction from 'd2-utilizr/src/isFunction';

type Props = {
};

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        class ShuoldFieldUpdateInterface extends React.Component<Props> {
            shouldComponentUpdate(nextProps: Props) {
                return Object.keys(nextProps)
                    .some(propName => nextProps[propName] !== this.props[propName] && !isFunction(nextProps[propName]));
            }

            render() {
                return (
                    <InnerComponent
                        {...this.props}
                    />
                );
            }
        };
