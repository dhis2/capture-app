// @flow
import React, { useMemo } from 'react';
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { useDataQuery } from '@dhis2/app-runtime';
import { useProgramInfo } from '../../../../hooks/useProgramInfo';
import { EnrollmentPageDefaultComponent } from './EnrollmentPageDefault.component';
import runRulesForEnrollmentPage from '../../../../rules/actionsCreator/runRulesForEnrollmentPage';


export const EnrollmentPageDefault = () => {
    const { teiId, programId, orgUnitId } = useSelector(({
        router: {
            location: {
                query,
            },
        },
    }) => ({ teiId: query.teiId, programId: query.programId, orgUnitId: query.orgUnitId }), shallowEqual);

    const orgUnit = useSelector(({ organisationUnits }) => organisationUnits[orgUnitId], shallowEqual);
    const [dataElements, setDataElements] = React.useState({});

    const { program } = useProgramInfo(programId);


    const programsQuery = useMemo(() => ({
        programRules: {
            resource: 'programs',
            id: programId,
            params: {
                fields:
                ['programStages[programStageDataElements[dataElement[id,valueType,optionSet[id,version]]'],
            },
        },
    }), [programId]);


    const { data, error: programStageError } = useDataQuery(programsQuery);
    if (programStageError) {
        log.error(errorCreator('Profile widget could not be loaded')({ programStageError }));
    }

    React.useEffect(() => {
        if (!Object.keys(dataElements).length && data) {
            setDataElements(extractDataElements(data));
        }
    }, [data, dataElements]);

    const extractDataElements = (rules) => {
        if (!rules?.programRules) { return {}; }
        return rules.programRules.programStages
            .reduce((acc, curr) => {
                curr.programStageDataElements.forEach((stage) => {
                    acc[stage.dataElement.id] = { ...stage.dataElement };
                });
                return acc;
            }, {});
    };


    React.useEffect(() => {
        if (Object.keys(dataElements).length) {
            const rules = runRulesForEnrollmentPage(program,
                orgUnit,
                program.stages,
                Array.from(program.stages, ([stage]) => ({ ...stage })),
                dataElements,
            );
            console.log({ rules });
        }
    }, [orgUnit, program, dataElements]);


    return (
        <EnrollmentPageDefaultComponent
            teiId={teiId}
            program={program}
        />
    );
};
