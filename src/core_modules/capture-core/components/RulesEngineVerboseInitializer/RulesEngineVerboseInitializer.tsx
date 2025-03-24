import { useRuleEngineFlags } from '../../rules/useRuleEngineFlags';

type Props = {
    children: React.ReactNode,
};

export const RulesEngineVerboseInitializer = ({ children }: Props) => {
    useRuleEngineFlags();

    return children;
};
