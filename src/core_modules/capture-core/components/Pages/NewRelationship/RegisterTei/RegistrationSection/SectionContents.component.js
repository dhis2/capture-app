// @flow
import * as React from 'react';
import { ProgramSelector } from './ProgramSelector';
import { RegUnitSelector } from './RegUnitSelector';

export const SectionContents = () => (
    <>
        <RegUnitSelector />
        <ProgramSelector />
    </>
);
