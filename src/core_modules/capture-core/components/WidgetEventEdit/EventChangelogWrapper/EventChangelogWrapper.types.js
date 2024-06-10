// @flow
import type { RenderFoundation } from '../../../metaData';

type PassOnProps = {|
    eventId: string,
    isOpen: boolean,
    setIsOpen: (boolean | boolean => boolean) => void,
|}

export type Props = {
    ...PassOnProps,
    formFoundation: RenderFoundation,
};
