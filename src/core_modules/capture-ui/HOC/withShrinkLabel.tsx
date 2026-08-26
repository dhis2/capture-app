import * as React from 'react';
import { ShrinkLabel } from '../internal/ShrinkLabel/ShrinkLabel.component';
import defaultClasses from './withShrinkLabel.module.css';

type Props = {
    inFocus?: boolean;
    value?: any;
    label?: string;
    shrinkDisabled?: boolean;
    [key: string]: any;
}

export const withShrinkLabel = () =>
    (InnerComponent: React.ComponentType<any>) =>
        class ShrinkLabelHOC extends React.Component<Props> {
            renderDisabled = (props: any) => (
                <InnerComponent
                    placeholder={this.props.label}
                    {...props}
                />
            )

            render() {
                const { shrinkDisabled, label, ...passOnProps } = this.props;
                const shrink = !!this.props.inFocus || !!this.props.value;

                if (shrinkDisabled) {
                    return this.renderDisabled(passOnProps);
                }

                return (
                    <div className={defaultClasses.container}>
                        <ShrinkLabel
                            shrink={shrink}
                        >{label}
                        </ShrinkLabel>
                        <InnerComponent
                            {...passOnProps}
                        />
                    </div>
                );
            }
        };
