// @flow
import { Icon } from 'capture-core/metaData';

export type Props = {|
  ...CssClasses,
  title: string,
  events: Array<ApiEnrollmentEvent>,
  icon?: Icon,
|}
