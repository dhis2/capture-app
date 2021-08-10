// @flow
import { ProgramStage } from 'capture-core/metaData';

export type Props = {|
  ...CssClasses,
  programStage: ?ProgramStage,
  programId: string,
  orgUnitId: string
|}
