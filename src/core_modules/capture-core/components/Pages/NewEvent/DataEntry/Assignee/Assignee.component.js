// @flow
import * as React from 'react';
import Username from '../../../../FormFields/Username/Username.component';

type Props = {

};

const Assignee = (props: Props) => {
    const { ...passOnProps } = props;

    return (
        <Username
            {...passOnProps}
        />
    );
};

export default Assignee;
