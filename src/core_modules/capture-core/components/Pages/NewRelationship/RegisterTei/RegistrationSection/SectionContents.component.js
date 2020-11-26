// @flow
import * as React from 'react';
import { ProgramSelector } from './ProgramSelector';
import { RegUnitSelector } from './RegUnitSelector';

const SectionContents = () => {
    return (
        <>
            <RegUnitSelector />
            <ProgramSelector />
        </>
    );
};
export default SectionContents;
