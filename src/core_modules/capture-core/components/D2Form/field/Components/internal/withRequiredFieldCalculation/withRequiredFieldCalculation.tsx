import * as React from 'react';

type Props = {
    metaCompulsory?: boolean | null,
    rulesCompulsory?: boolean | null,
};

export const withRequiredFieldCalculation = () =>
    (InnerComponent: React.ComponentType<any>) =>
        class RequiredFieldCalculationHOC extends React.Component<Props> {
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
