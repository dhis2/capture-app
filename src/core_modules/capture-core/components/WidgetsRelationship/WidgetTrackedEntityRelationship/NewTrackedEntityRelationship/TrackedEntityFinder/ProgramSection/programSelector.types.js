// @flow
import type { GetPrograms } from '../../common';

export type Props = $ReadOnly<{|
    selectedProgramId: ?string,
    onSelectProgram: (programId: ?string) => void,
    trackedEntityTypeId: string,
    getPrograms: GetPrograms,
|}>;
