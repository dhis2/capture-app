// @flow
import * as React from 'react';

type Props = {
    error?: ?string,
};

const withErrorMessageHandler = () => (InnerComponent: React.ComponentType<any>) => (props: Props) => {
    const { error, ...passOnProps } = props;

    if (error) {
        return (
            <div>
                {error}
            </div>
        );
    }

    return (
        <InnerComponent
            {...passOnProps}
        />
    );
};

export default withErrorMessageHandler;
