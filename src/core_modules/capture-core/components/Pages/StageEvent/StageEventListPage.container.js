// @flow
import React from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import { useProgramInfo } from 'capture-core/hooks/useProgramInfo';
import { StageEventListPageComponent } from './StageEventListPage.component';

export const StageEventListPage = () => {
    const { stageId, programId, orgUnitId } =
      useSelector(({ router: { location: { query } } }) => (
          {
              stageId: query.stageId,
              programId: query.programId,
              orgUnitId: query.orgUnitId,

          }), shallowEqual);

    const { program } = useProgramInfo(programId);
    const programStage = program?.stages && program.stages.get(stageId);

    if (!programStage) {
        log.error(
            errorCreator(
                'Could not find stage')(
                {
                    program: programId,
                    programStage: stageId,
                },
            ),
        );
        return null;
    }

    return <StageEventListPageComponent programStage={programStage} programId={programId} orgUnitId={orgUnitId} />;
};
