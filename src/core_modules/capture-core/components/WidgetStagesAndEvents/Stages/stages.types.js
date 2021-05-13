// @flow
import { any } from 'prop-types';
import type { ProgramStage } from '../../../metaData';

export type Props = {|
    stages: Map<string, ProgramStage>,
    events: any,
    ...CssClasses,
|};
