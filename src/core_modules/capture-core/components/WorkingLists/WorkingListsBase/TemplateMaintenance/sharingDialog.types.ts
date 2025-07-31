import type { WithStyles } from '@material-ui/core';
import type { SharingSettings } from '../workingListsBase.types';

type CssClasses = WithStyles<{
    dialog: any;
}>;

export type Props = {
    onClose: (sharingSettings: SharingSettings) => void;
    open: boolean;
    templateId: string;
    templateSharingType: string;
    dataTest: string;
} & CssClasses;
