// @flow
import { useState, useEffect } from 'react';
import type { ProgramRulesContainer } from 'capture-core-utils/rulesEngine';

import { useProgramRules, useConstants } from './index';
import { buildRulesContainer } from '../ProgramRules';

export const useRulesContainer = (programAPI: any) => {
    const { programRules, loading: loadingProgramRules } = useProgramRules(programAPI.id);
    const { constants } = useConstants();
    const [rulesContainer, setRulesContainer] = useState<ProgramRulesContainer>({});

    useEffect(() => {
        if (!loadingProgramRules && constants) {
            buildRulesContainer({ programAPI, setRulesContainer, programRules, constants });
        }
    }, [programAPI, loadingProgramRules, programRules, constants]);

    return rulesContainer;
};
