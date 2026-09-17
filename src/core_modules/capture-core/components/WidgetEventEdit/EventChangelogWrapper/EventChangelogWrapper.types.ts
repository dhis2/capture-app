import type { RenderFoundation } from '../../../metaData';

type PassOnProps = {
    eventId: string,
    isOpen: boolean,
    setIsOpen: (value: boolean | ((prev: boolean) => boolean)) => void,
}

export type Props = PassOnProps & {
    formFoundation: RenderFoundation,
    eventData: Record<string, unknown>,
};
