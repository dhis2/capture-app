// @flow
import type { SharingSettings } from '../workingLists.types';

export type Props = {|
    onClose: (sharingSettings: SharingSettings) => void,
    open: boolean,
    templateId: string,
    ...CssClasses,
|};
