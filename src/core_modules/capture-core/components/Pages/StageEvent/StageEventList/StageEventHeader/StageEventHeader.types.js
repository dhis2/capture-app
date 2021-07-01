// @flow
import { Icon } from 'capture-core/metaData';
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';

export type Props = {|
  ...CssClasses,
  title: string,
  events: Array<ApiTEIEvent>,
  icon?: Icon,
|}
