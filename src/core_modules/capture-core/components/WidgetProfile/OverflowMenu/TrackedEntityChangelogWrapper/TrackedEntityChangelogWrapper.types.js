// @flow
import type { TrackerProgram } from '../../../../metaData';

type PassOnProps = {|
    teiId: string,
    isOpen: boolean,
    setIsOpen: (boolean | boolean => boolean) => void,
    trackedEntityData: Object,
|}

export type Props = {
    ...PassOnProps,
    programAPI: TrackerProgram,
};
