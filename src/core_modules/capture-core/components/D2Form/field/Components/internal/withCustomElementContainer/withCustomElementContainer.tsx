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
    (InnerComponent: React.ComponentType<any>) =>
        class CustomElementContainerHOC extends React.Component<Props> {
            defaultClass?: string | null;
            constructor(props: Props) {
                super(props);
                this.defaultClass = onGetContainerClass && onGetContainerClass(this.props);
            }

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
