// @flow
import { useState, useEffect } from 'react';
import { buildFormFoundation } from '../FormFoundation';

export const useFormFoundation = (programAPI: any) => {
    const [formFoundation, setFormFoundation] = useState<any>({});

    useEffect(() => {
        buildFormFoundation(programAPI, setFormFoundation);
    }, [programAPI]);

    return formFoundation;
};
