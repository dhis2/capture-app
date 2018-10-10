// @flow
import React from 'react';

type Props = {|
    customFormElementProps: {
        id: string,
        style: ?Object,
        className: ?string,
    }
|};
type OnGetWidth = (width: ?number | string, props: Props) => number | Object;

export default (onGetWidth: OnGetWidth) =>
    (InnerComponent: React.ComponentType<any>) =>
        class CustomElementContainerHOC extends React.Component<Props> {
            widthResult: number | Object;
            constructor(props: Props) {
                super(props);
                this.widthResult = onGetWidth(this.getSpecifiedWidth(), this.props);
            }

            componentDidMount() {
                
            }

            getSpecifiedWidth() {
                const { customFormElementProps } = this.props;
                const { style } = customFormElementProps;
                if (style && style.width) {
                    return style.width;
                }
                return undefined;
            }

            render() {
                let { customFormElementProps, ...passOnProps } = this.props; //eslint-disable-line
                let style = customFormElementProps.style;

                const widthResult = this.widthResult;
                if (typeof widthResult === 'object' && widthResult !== null) {
                    passOnProps = { ...passOnProps, ...widthResult };
                } else if (typeof widthResult === 'number' && isFinite(widthResult)) {
                    style = { ...style, width: widthResult };
                }

                return (
                    <div
                        {...customFormElementProps}
                        style={style}
                    >
                        <InnerComponent
                            {...passOnProps}
                        />
                    </div>
                );
            }
        };
