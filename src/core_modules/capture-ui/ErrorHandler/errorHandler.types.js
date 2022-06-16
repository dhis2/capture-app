// @flow
import type { Node } from 'react';

export type Props = $ReadOnly<{|
    error?: string,
    children: Node,
|}>;
