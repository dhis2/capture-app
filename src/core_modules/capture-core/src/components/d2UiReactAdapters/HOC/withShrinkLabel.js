// @flow
import * as React from 'react';
import ShrinkLabel from '../internal/ShrinkLabel/ShrinkLabel.component';

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
                    <div style={{ position: 'relative' }}>
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
