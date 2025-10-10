import type {
    RulesEngineInput,
    OutputEffects,
    Flag,
} from '@dhis2/rules-engine-javascript';
import { RuleExecutionManager } from './ruleExecution';

const worker = new Worker(new URL('worker/worker.js', import.meta.url));

const ruleExecutionManager = new RuleExecutionManager;

worker.onmessage = (event) => {
    const {
        executionEnvironment,
        executionId,
        effects,
    } = event.data;
    ruleExecutionManager.resolveExecution(executionEnvironment, executionId, effects);
};

class RuleEngine {
    flags: Flag;

    constructor() {
        this.flags = { verbose: false };
    }

    static getProgramRuleEffects(rulesEngineInput: RulesEngineInput): Promise<OutputEffects> {
        return new Promise((resolve, reject) => {
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

            setTimeout(() => {
                // This will do nothing if the promise is already settled
                ruleExecutionManager.abortExecution(executionEnvironment, executionId, 'Execution of rules timed out');
            }, 10000);
        });
    }

    static setSelectedUserRoles(userRoles: Array<string>) {
        worker.postMessage({
            queryMethod: 'setSelectedUserRoles',
            queryArguments: userRoles,
        });
    }

    setFlags(flags: Flag) {
        this.flags = flags;
        worker.postMessage({
            queryMethod: 'setFlags',
            queryArguments: flags,
        });
    }

    getFlags(): Flag {
        return this.flags;
    }
}

export const initRulesEngine = (version: string, userRoles: Array<{ id: string }>) => {
    worker.postMessage({
        queryMethod: 'initRulesEngine',
        queryArguments: {
            version,
            userRoles,
        },
    });
};

export const ruleEngine = () => new RuleEngine();
