// @flow

import type { Element } from 'react';

export type QuickActionButtonTypes = {|
    icon: Element<any>,
    label: string,
    onClickAction: () => void,
    dataTest?: string,
    disable?: boolean,
    ...CssClasses,
|}
