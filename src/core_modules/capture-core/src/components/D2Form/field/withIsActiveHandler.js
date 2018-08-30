// @flow
import * as React from 'react';

type Props = {
};

type State = {
    active: boolean,
};

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        class DefaultIsActiveHandler extends React.Component<Props, State> {
            constructor(props: Props) {
                super(props);
                this.state = {
                    active: false,
                };
            }

            setActive = () => {
                this.setState({
                    active: true,
                });
            }

            setInactive = () => {
                this.setState({
                    active: false,
                });
            }

            render() {
                const { active } = this.state;
                return (
                    <InnerComponent
                        active={active}
                        onSetActive={this.setActive}
                        onSetInactive={this.setInactive}
                        {...this.props}
                    />
                );
            }
        };
