// @flow
import * as React from 'react';
import { ProgramSelector } from './ProgramSelector';
import { RegUnitSelector } from './RegUnitSelector';

type Props = {
    trackedEntityTypeId: string,
};

export const SectionContents = ({ trackedEntityTypeId }: Props) => (
    <>
        <RegUnitSelector />
        <ProgramSelector
            trackedEntityTypeId={trackedEntityTypeId}
        />
    </>
);
