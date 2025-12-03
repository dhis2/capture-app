import type { RulesEngineInput, Flag } from '@dhis2/rules-engine-javascript';
import { initRuleEngine, ruleEngine } from './ruleEngine';

type InitArgs = {
    version: string,
    userRoles: Array<{ id: string }>,
    useKotlinAsFallback: boolean,
};

type ExecutionArgs = {
    executionId: string,
    rulesEngineInput: RulesEngineInput,
};

const handlers = {
    initRulesEngine: ({ version, userRoles, useKotlinAsFallback }: InitArgs) => {
        initRuleEngine(version, userRoles, useKotlinAsFallback);
    },
    setSelectedUserRoles: (userRoles: Array<string>) => {
        ruleEngine().setSelectedUserRoles(userRoles);
    },
    setFlags: (flags: Flag) => {
        ruleEngine().setFlags(flags);
    },
    getProgramRuleEffects: ({ executionId, rulesEngineInput }: ExecutionArgs) => {
        const effects = ruleEngine().getProgramRuleEffects(rulesEngineInput);
        postMessage({
            executionEnvironment: rulesEngineInput.executionEnvironment || '',
            executionId,
            effects,
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
