// @flow
import { useMemo } from 'react';
import { programCollection } from '../programCollection';
import type { Program, ProgramStage } from '../../../metaData';

type ErrorResult = {|
    error: string,
    program: void,
    programStage: void,
|};

type Result = {|
    program: Program,
    programStage: ProgramStage,
    error: void,
|};


const createErrorResult = (error: string): ErrorResult => ({
    error,
    program: undefined,
    programStage: undefined,
});

const createResult = (program: Program, programStage: ProgramStage): Result => ({
    program,
    programStage,
    error: undefined,
});

export const useProgramStageInfo = (programStageId?: string, programId?: string) =>
    useMemo((): Result | ErrorResult => {
        let programStageInfo;
        [
            () => {
                if (!programId && !programStageId) {
                    return createErrorResult('At least one argument must be supplied');
                }
                return undefined;
            },
            () => {
                if (!programId) {
                    return undefined;
                }

                const program = programCollection.get(programId);
                if (!program) {
                    return createErrorResult('Program not found');
                }

                const programStage = programStageId ?
                    program.stages.get(programStageId) :
                    [...program.stages.values()][0];

                if (!programStage) {
                    return createErrorResult('Program stage not found');
                }

                return createResult(
                    program,
                    programStage,
                );
            },
            () => {
                let result;
                [...programCollection.values()].some((program) => {
                    // $FlowFixMe
                    const programStage = program.stages.get(programStageId);
                    if (programStage) {
                        result = createResult(
                            program,
                            programStage,
                        );
                    }
                    return Boolean(result);
                });
                return result || createErrorResult('Program stage not found');
            },
        ].some((compute) => {
            programStageInfo = compute();
            return Boolean(programStageInfo);
        });
        // $FlowFixMe
        return programStageInfo;
    }, [programId, programStageId]);
