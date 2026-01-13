import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import type { Icon } from '../../../../../metaData';

export type Props = {
    title: string;
    events: Array<ApiEnrollmentEvent>;
    icon?: Icon;
    description?: string | null;
};
