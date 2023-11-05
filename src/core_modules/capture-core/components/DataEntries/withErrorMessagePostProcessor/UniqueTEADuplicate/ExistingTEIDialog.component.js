// @flow
import React from 'react';
import { Modal } from '@dhis2/ui';
import { ExistingTEILoader } from './ExistingTEILoader.container';

type Props = {
    open: boolean,
    onCancel: () => void,
};

export const ExistingTEIDialog = (props: Props) => {
    const { open, ...passOnProps } = props;
    return (
        <Modal
            hide={!open}
            onClose={props.onCancel}
        >
            <ExistingTEILoader
                {...passOnProps}
            />
        </Modal>
    );
};
