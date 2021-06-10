// @flow
import { Icon, Event } from 'capture-core/metaData';

export type Props = {|
  ...CssClasses,
  title: string,
  events: Array<Event>,
  icon?: Icon,
|}
