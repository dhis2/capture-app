// @flow
import { ProgramStage } from 'capture-core/metaData';

export type Props = {|
  ...CssClasses,
  stage: ?ProgramStage;
  programId: string,
  orgUnitId: string
|}
