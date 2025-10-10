import { RulesEngineInput, Flag } from '@dhis2/rules-engine-javascript';
import { initRuleEngine, ruleEngine } from './ruleEngine';

type InitData = {
    version: string,
    userRoles: Array<{ id: string }>,
};

type ExecutionArgs = {
    executionId: string,
    input: RulesEngineInput,
};

const handlers = {
    initRulesEngine: ({ version, userRoles }: InitData) => {
        initRuleEngine(version, userRoles);
    },
    setSelectedUserRoles: (userRoles: Array<string>) => {
        ruleEngine().setSelectedUserRoles(userRoles);
    },
    setFlags: (flags: Flag) => {
        ruleEngine().setFlags(flags);
    },
    getProgramRuleEffects: ({ executionId, input }: ExecutionArgs) => {
        postMessage({
            executionEnvironment: input.executionEnvironment,
            executionId,
            effects: ruleEngine().getProgramRuleEffects(input),
        });
    },
};

onmessage = (event) => {
    const {
        queryMethod,
        queryArguments,
    } = event.data;

    handlers[queryMethod](queryArguments);
};
