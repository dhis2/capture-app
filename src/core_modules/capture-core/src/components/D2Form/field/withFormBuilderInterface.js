// @flow
import * as React from 'react';

type Event = {
    target: {
        value: any,
    }
};
type Props = {
    onBlur: (event: Event, options?: ?Object) => void,
    onChange: (event: Event, options?: ?Object) => void,
    changeEvent: string,
    errorStyle: ?string,
    errorText: ?string
};

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        class FormBuilderInterfaceBuilder extends React.Component<Props> {
            handleBlur: (value: any) => void;
            handleChange: (value: any) => void;

            static getEvent(value: any) {
                return {
                    target: {
                        value,
                    },
                };
            }

            constructor(props: Props) {
                super(props);
                this.handleBlur = this.handleBlur.bind(this);
                this.handleChange = this.handleChange.bind(this);
            }

            handleChange(value: any, options?: ?Object) {
                const onChange = this.props.onChange;
                onChange(FormBuilderInterfaceBuilder.getEvent(value), options);
            }

            handleBlur(value: any, options?: ?Object) {
                const onBlur = this.props.onBlur;
                onBlur(FormBuilderInterfaceBuilder.getEvent(value), options);
            }

            render() {
                const { onBlur, onChange, changeEvent, errorStyle, errorText, ...passOnProps } = this.props;

                return (
                    <InnerComponent
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        {...passOnProps}
                    />
                );
            }
        };
