import * as React from 'react';

const getStyledContainerHOC = (InnerComponent: React.ComponentType<any>, getStyles: (props: any) => any | null) =>
    class StyledContainerHOC extends React.Component<any> {
        render() {
            const { ...passOnProps } = this.props;

            return (
                <div
                    style={getStyles(this.props) as React.CSSProperties}
                >
                    <InnerComponent
                        {...passOnProps}
                    />
                </div>
            );
        }
    };

export const withStyledContainer = (getStyles: (props: any) => any | null) =>
    (InnerComponent: React.ComponentType<any>) =>
        getStyledContainerHOC(InnerComponent, getStyles);
