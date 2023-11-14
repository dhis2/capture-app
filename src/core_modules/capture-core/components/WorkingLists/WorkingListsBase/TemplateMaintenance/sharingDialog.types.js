// @flow
import type { SharingSettings } from '../workingListsBase.types';

export type Props = {|
    onClose: (sharingSettings: SharingSettings) => void,
    open: boolean,
    templateId: string,
    templateSharingType: string,
    dataTest: string,
    ...CssClasses,
|};
