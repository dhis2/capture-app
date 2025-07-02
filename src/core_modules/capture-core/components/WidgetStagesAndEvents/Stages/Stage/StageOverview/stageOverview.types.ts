import type { WithStyles } from '@material-ui/core';
import type { Icon } from '../../../../../metaData';
import type { ApiEnrollmentEvent } from '../../../../../../capture-core-utils/types/api-types';

export type Props = {
    title: string;
    events: Array<ApiEnrollmentEvent>;
    icon?: Icon;
    description?: string | null;
} & WithStyles<any>;
