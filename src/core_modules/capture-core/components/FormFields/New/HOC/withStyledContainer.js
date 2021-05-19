// @flow
import * as React from 'react';

const getStyledContainerHOC = (InnerComponent: React.ComponentType<any>, getStyles: Function) =>
    class StyledContainerHOC extends React.Component<Object> {
        render() {
            const { ...passOnProps } = this.props;

            return (
                <div
                    style={getStyles(this.props)}
                >
                    <InnerComponent
                        {...passOnProps}
                    />
                </div>
            );
        }
    };

export const withStyledContainer = (getStyles: (props: Object) => ?Object) =>
    (InnerComponent: React.ComponentType<any>) =>
        getStyledContainerHOC(InnerComponent, getStyles);
