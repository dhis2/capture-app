// @flow
import * as React from 'react';
import isFunction from 'd2-utilizr/lib/isFunction';

type Props = {
};

export const withDefaultShouldUpdateInterface = () =>
    (InnerComponent: React.ComponentType<any>) =>
        class ShouldFieldUpdateInterface extends React.Component<Props> {
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
