// @flow
import * as React from 'react';
import D2UISharingDialog from '@dhis2/d2-ui-sharing-dialog';
import { getD2 } from '../../../../../d2';

type Props = {
    onClose: () => void,
    open: boolean,
    templateId: string,
};

const SharingDialog = (props: Props) => {
    const { onClose, open, templateId } = props;
    return(
        <D2UISharingDialog
            open={open}
            id={templateId}
            onRequestClose={onClose}
            type={'eventFilter'}
            d2={getD2()}
        />
    );
};

export default SharingDialog;
