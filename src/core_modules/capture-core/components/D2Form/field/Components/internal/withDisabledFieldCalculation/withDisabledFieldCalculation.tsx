import * as React from 'react';

type Props = {
    metaDisabled?: boolean | null,
    rulesDisabled?: boolean | null,
};

export const withDisabledFieldCalculation = () =>
    (InnerComponent: React.ComponentType<any>) =>
        class DisabledFieldCalculationHOC extends React.Component<Props> {
            render() {
                const { metaDisabled, rulesDisabled, ...passOnProps } = this.props;

                return (
                    <InnerComponent
                        disabled={!!(metaDisabled || rulesDisabled)}
                        {...passOnProps}
                    />
                );
            }
        };
