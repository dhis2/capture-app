import React from 'react';
import classNames from 'classnames';

type Props = {
    customFormElementProps: {
        id: string,
        style: any | null,
        className: string | null,
    }
};
type OnGetContainerClass = (props: any) => string | null;

export const withCustomElementContainer = (onGetContainerClass?: OnGetContainerClass) =>
    // $FlowFixMe[prop-missing] automated comment
    (InnerComponent: React.ComponentType<any>) =>
        class CustomElementContainerHOC extends React.Component<Props> {
            constructor(props: Props) {
                super(props);
                this.defaultClass = onGetContainerClass && onGetContainerClass(this.props);
            }
            defaultClass?: string | null;

            render() {
                const { customFormElementProps, ...passOnProps } = this.props;
                const containerClass = classNames(customFormElementProps.className, this.defaultClass);

                return (
                    <div
                        {...customFormElementProps}
                        className={containerClass}
                    >
                        <InnerComponent
                            {...passOnProps}
                        />
                    </div>
                );
            }
        };
