// @flow
import { string } from 'prop-types';
import { ProgramStage } from '../../../metaData';

export type Props = {|
    programStage: ProgramStage,
    currentScopeId: string,
    ...CssClasses,
|};
