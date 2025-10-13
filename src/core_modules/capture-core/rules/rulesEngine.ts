import type {
    RulesEngineInput,
    OutputEffects,
    Flag,
} from '@dhis2/rules-engine-javascript';
import { featureAvailable, FEATURES } from 'capture-core-utils/featuresSupport';
import { RuleExecutionManager } from './ruleExecution';

const worker = new Worker(new URL('ruleExecution/worker.js', import.meta.url));

const ruleExecutionManager = new RuleExecutionManager;

worker.onmessage = (event) => {
    const {
        executionEnvironment,
        executionId,
        effects,
    } = event.data;
    ruleExecutionManager.resolveExecution(executionEnvironment, executionId, effects);
};

export const initRulesEngine = (version: string, userRoles: Array<{ id: string }>) => {
    worker.postMessage({
        queryMethod: 'initRulesEngine',
        queryArguments: {
            version,
            userRoles,
            useKotlinAsFallback: featureAvailable(FEATURES.kotlinRuleEngine),
        },
    });
};

export const ruleEngine = {
    flags: { verbose: false },

    getProgramRuleEffects: (rulesEngineInput: RulesEngineInput): Promise<OutputEffects> =>
        new Promise<OutputEffects>((resolve, reject) => {
            const executionEnvironment = rulesEngineInput.executionEnvironment || '';
            const executionId = ruleExecutionManager.newExecution({
                executionEnvironment,
                resolve,
                reject,
            });

            worker.postMessage({
                queryMethod: 'getProgramRuleEffects',
                queryArguments: {
                    executionId,
                    rulesEngineInput,
                },
            });
        }),

    setSelectedUserRoles: (userRoles: Array<string>) => {
        worker.postMessage({
            queryMethod: 'setSelectedUserRoles',
            queryArguments: userRoles,
        });
    },

    setFlags: (flags: Flag) => {
        ruleEngine.flags = flags;
        worker.postMessage({
            queryMethod: 'setFlags',
            queryArguments: flags,
        });
    },

    getFlags: (): Flag => ruleEngine.flags,
};
