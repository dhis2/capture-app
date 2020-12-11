// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import ExistingTEILoader from './ExistingTEILoader.container';

type Props = {
    open: boolean,
    onCancel: () => void,
};

const ExistingTEIDialog = (props: Props) => {
    const { open, ...passOnProps } = props;
    return (
        <Dialog
            fullWidth
            maxWidth="md"
            open={open}
            onClose={props.onCancel}
        >
            <ExistingTEILoader
                {...passOnProps}
            />
        </Dialog>
    );
};

export default ExistingTEIDialog;
