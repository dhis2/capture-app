// @flow
import * as React from 'react';
import ShrinkLabel from '../internal/ShrinkLabel/ShrinkLabel.component';
import defaultClasses from '../../d2Ui/internal/shrinkLabel/shrinkLabel.mod.css';

type Props = {
    inFocus?: ?boolean,
    value?: ?any,
    label?: ?string,
}

export default (hocParams: ?HOCParamsContainer) =>
    (InnerComponent: React.ComponentType<any>) =>
        class ShrinkLabelHOC extends React.Component<Props> {
            render() {
                const shrink = !!this.props.inFocus || !!this.props.value;

                return (
                    <div className={defaultClasses.container}>
                        <ShrinkLabel
                            shrink={shrink}
                        >{this.props.label}
                        </ShrinkLabel>
                        <InnerComponent
                            {...this.props}
                        />
                    </div>
                );
            }
        };
