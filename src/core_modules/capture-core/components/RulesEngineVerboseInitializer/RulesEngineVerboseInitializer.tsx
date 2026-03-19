import type { ReactNode } from 'react';
import { useRuleEngineFlags } from '../../rules/useRuleEngineFlags';

type Props = {
    children: ReactNode;
};

export const RulesEngineVerboseInitializer = ({ children }: Props) => {
    useRuleEngineFlags();

    return children;
};
