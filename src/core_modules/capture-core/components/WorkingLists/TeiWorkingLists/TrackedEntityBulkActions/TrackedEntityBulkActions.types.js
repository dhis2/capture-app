// @flow
import type { ProgramStage } from '../../../../metaData';

type BaseProps = {|
    selectedRows: { [key: string]: boolean },
    programId: string,
    stages: Map<string, ProgramStage>,
    onClearSelection: () => void,
    programDataWriteAccess: boolean,
    onUpdateList: () => void,
    removeRowsFromSelection: (rows: Array<string>) => void,
    setShowBulkDataEntryPlugin: (show: boolean) => void,
|}

export type Props = {|
    ...BaseProps,
    bulkDataEntryIsActive: boolean,
|}

export type ContainerProps = {|
    ...BaseProps,
    programStageId: ?string,
|}
