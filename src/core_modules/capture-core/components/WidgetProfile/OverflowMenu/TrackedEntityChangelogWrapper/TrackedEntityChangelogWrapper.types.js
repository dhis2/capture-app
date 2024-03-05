// @flow
import type { TrackerProgram } from '../../../../metaData';

type PassOnProps = {|
    teiId: string,
    isOpen: boolean,
    setIsOpen: (boolean | boolean => boolean) => void,
|}

export type Props = {
    ...PassOnProps,
    programAPI: TrackerProgram,
};
