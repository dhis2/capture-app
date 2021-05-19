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
    const { enrollmentId, teiId, programId, orgUnitId } = useSelector(({
        router: {
            location: {
                query,
            },
        },
    }) => (
        { enrollmentId: query.enrollmentId,
            teiId: query.teiId,
            programId: query.programId,
            orgUnitId: query.orgUnitId,
        }), shallowEqual);
    const orgUnit = useSelector(({ organisationUnits }) => organisationUnits[orgUnitId], shallowEqual);

    const [dataElements, setDataElements] = React.useState({});
    const [teiAttributes, setTeiAttributes] = React.useState({});

    const { program } = useProgramInfo(programId);

    const teiAttributesQuery = useMemo(() => ({
        teiAttributes: {
            resource: 'trackedEntityInstances',
            id: teiId,
            params: { fields: ['enrollments[*],attributes'] },
        },
    }), [teiId]);

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


    const { error: programStageError } = useDataQuery(programsQuery, {
        onComplete: data => setDataElements(extractDataElements(data)),
    });

    const { error: teiError } = useDataQuery(teiAttributesQuery, {
        onComplete: attributesData => setTeiAttributes(attributesData),
    });

    if (programStageError || teiError) {
        log.error(errorCreator('Profile widget could not be loaded')({ programStageError, teiError }));
    }

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
        if (Object.keys(dataElements).length && Object.keys(teiAttributes).length) {
            const { attributes, enrollments } = teiAttributes;
            const currentTEIValues = attributes?.map(item => ({ id: item.attribute, valueType: item.valueType }));
            const currentEnrollmentValues = attributes?.reduce((acc, item) => {
                acc[item.attribute] = item.value;
                return acc;
            }, {});
            const rules = runRulesForEnrollmentPage(
                program,
                orgUnit,
                Array.from(program.stages, ([stage]) => ({ ...stage })),
                dataElements,
                { enrollmentDate: enrollments?.[0].enrollmentDate,
                    incidentDate: enrollments?.[0].incidentDate,
                    enrollmentId: enrollments?.[0].enrollmentId },
                currentEnrollmentValues,
                currentTEIValues,
            );
            console.log({ rules });
        }
    }, [orgUnit, program, dataElements, teiAttributes]);


    return (
        <EnrollmentPageDefaultComponent
            teiId={teiId}
            program={program}
            enrollmentId={enrollmentId}
        />
    );
};
