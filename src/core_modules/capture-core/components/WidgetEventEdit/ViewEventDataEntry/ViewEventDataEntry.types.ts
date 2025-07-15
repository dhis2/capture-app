import type { WithStyles } from '@material-ui/core';
import type { RenderFoundation } from '../../../metaData';

export type OrgUnit = {
    id: string;
    name: string;
    path: string;
};

export type PlainProps = {
    formFoundation?: RenderFoundation | null;
    orgUnit: OrgUnit;
    programId: string;
    itemId: string;
    dataEntryId: string;
    assignee?: any;
    orgUnitFieldValue?: OrgUnit | null;
};

export type Props = PlainProps & WithStyles<any> & {
    theme: any;
    classes: {
        fieldLabelMediaBased: string;
    };
};
