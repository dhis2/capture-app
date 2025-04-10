import React from 'react';
import { ProgramSelector } from './ProgramSelector';
import { RegUnitSelector } from './RegUnitSelector';
import type { SectionContentsProps } from './RegistrationSection.types';

export const SectionContents = ({ trackedEntityTypeId }: SectionContentsProps) => (
    <>
        <RegUnitSelector />
        <ProgramSelector
            trackedEntityTypeId={trackedEntityTypeId}
        />
    </>
);
