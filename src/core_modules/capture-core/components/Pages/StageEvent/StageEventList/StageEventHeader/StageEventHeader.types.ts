import type { Icon } from 'capture-core/metaData';
import type { ApiEnrollmentEvent } from '../../../../../../capture-core-utils/types/api-types';

export type PlainProps = {
  title: string;
  events: Array<ApiEnrollmentEvent>;
  icon?: Icon;
};
