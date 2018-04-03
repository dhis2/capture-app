// @flow
import * as React from 'react';

type Props = {
    metaCompulsory?: ?boolean,
    rulesCompulsory?: ?boolean,
};

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        class HideFieldCompatibilityInterface extends React.Component<Props> {
            render() {
                const { metaCompulsory, rulesCompulsory, ...passOnProps } = this.props;

                return (
                    <InnerComponent
                        required={!!(metaCompulsory || rulesCompulsory)}
                        {...passOnProps}
                    />
                );
            }
        };
