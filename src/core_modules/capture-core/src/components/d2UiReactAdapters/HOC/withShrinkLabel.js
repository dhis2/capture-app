// @flow
import * as React from 'react';
import ShrinkLabel from '../internal/ShrinkLabel/ShrinkLabel.component';
import defaultClasses from '../../d2Ui/internal/shrinkLabel/shrinkLabel.mod.css';

type Props = {
    inFocus?: ?boolean,
    value?: ?any,
    label?: ?string,
    shrinkDisabled?: ?boolean,
}

export default (hocParams: ?HOCParamsContainer) =>
    (InnerComponent: React.ComponentType<any>) =>
        class ShrinkLabelHOC extends React.Component<Props> {
            renderDisabled = (props: any) => (
                <InnerComponent
                    placeholder={this.props.label}
                    {...props}
                />
            )

            render() {
                const { shrinkDisabled, ...passOnProps } = this.props;
                const shrink = !!this.props.inFocus || !!this.props.value;

                if (shrinkDisabled) {
                    return this.renderDisabled(passOnProps);
                }

                return (
                    <div className={defaultClasses.container}>
                        <ShrinkLabel
                            shrink={shrink}
                        >{this.props.label}
                        </ShrinkLabel>
                        <InnerComponent
                            {...passOnProps}
                        />
                    </div>
                );
            }
        };
