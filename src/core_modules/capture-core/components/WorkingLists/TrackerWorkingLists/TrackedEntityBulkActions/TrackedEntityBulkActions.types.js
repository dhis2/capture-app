// @flow
import type { ProgramStage } from '../../../../metaData';

export type Props = {|
    selectedRows: { [key: string]: boolean },
    programId: string,
    stages: Map<string, ProgramStage>,
    onClearSelection: () => void,
    programDataWriteAccess: boolean,
    onUpdateList: () => void,
    removeRowsFromSelection: (rows: Array<string>) => void,
|}

export type ContainerProps = {|
    ...Props,
    programStageId: ?string,
|}
