type RuleExecution = {
    executionId: number,
    resolve: (any) => void,
    reject: (any) => void,
};

type NewExecutionInput = {
    executionEnvironment: string,
    resolve: (any) => void,
    reject: (any) => void,
};

export class RuleExecutionManager {
    executions: { [executionEnvironment: string]: RuleExecution | undefined };
    nextExecutionId: number;

    constructor() {
        this.executions = {};
        this.nextExecutionId = 0;
    }

    newExecution({ executionEnvironment, resolve, reject }: NewExecutionInput): number {
        if (this.executions[executionEnvironment]) {
            this.abortExecution(
                executionEnvironment,
                this.executions[executionEnvironment].executionId,
                `Rule execution superseded in ${executionEnvironment || '???'}`,
            );
        }

        this.nextExecutionId += 1;

        const executionId = this.nextExecutionId;

        this.executions[executionEnvironment] = {
            executionId,
            resolve,
            reject,
        };

        return executionId;
    }

    resolveExecution(executionEnvironment: string, executionId: number, result: any) {
        if (this.executions[executionEnvironment] && this.executions[executionEnvironment].executionId === executionId) {
            this.executions[executionEnvironment].resolve(result);
            this.executions[executionEnvironment] = undefined;
        }
    }

    abortExecution(executionEnvironment: string, executionId: number, error: any) {
        if (this.executions[executionEnvironment] && this.executions[executionEnvironment].executionId === executionId) {
            this.executions[executionEnvironment].reject(error);
            this.executions[executionEnvironment] = undefined;
        }
    }
}
