// @flow
import type { Node } from 'react';

export type Props = $ReadOnly<{|
    loading: boolean,
    children: Node,
|}>;
