// @flow
import { useRuleEngineFlags } from '../../rules/useRuleEngineFlags';

type Props = {|
    children: React$Node,
|};
export const RulesEngineVerboseInitializer = ({ children }: Props) => {
    useRuleEngineFlags();

    return children;
};
