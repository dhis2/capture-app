// @flow
import { Instant, LocalDate } from '@js-joda/core';
import {
    RuleActionJs,
    RuleDataValueJs,
    RuleEngineContextJs,
    RuleEnrollmentJs,
    RuleEventJs,
    RuleJs,
    RuleVariableJs,
    RuleAttributeValue,
    RuleEnrollmentStatus,
    RuleEventStatus,
    RuleValueType,
    RuleVariableType,
} from '@dhis2/rule-engine';
import { ValueProcessor } from './ValueProcessor';
import {
    attributeTypes,
    effectActions,
    typeKeys,
} from '../constants';
import type {
    ProgramRule,
    ProgramRuleAction,
    ProgramRuleVariable,
    ProgramRulesContainer,
    OrgUnit,
    Option,
    OptionSets,
    Constants,
    EventData,
    Enrollment,
    TEIValues,
    DataElements,
    TrackedEntityAttributes,
    IConvertInputRulesValue,
} from '../types/ruleEngine.types';
import type {
    KotlinOption,
    KotlinOptionSets,
} from '../types/kotlinRuleEngine.types';

const programRuleVariableSourceIdExtractor = {
    DATAELEMENT_CURRENT_EVENT: variable => variable.dataElementId,
    DATAELEMENT_NEWEST_EVENT_PROGRAM: variable => variable.dataElementId,
    DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE: variable => variable.dataElementId,
    DATAELEMENT_PREVIOUS_EVENT: variable => variable.dataElementId,
    TEI_ATTRIBUTE: variable => variable.trackedEntityAttributeId,
    CALCULATED_VALUE: () => '',
};

const eventMainKeys = new Set([
    'eventId',
    'programId',
    'programStageId',
    'programStageName',
    'orgUnitId',
    'trackedEntityInstanceId',
    'enrollmentId',
    'enrollmentStatus',
    'status',
    'occurredAt',
    'scheduledAt',
    'completedAt',
]);

const convertAssignAction = (action: ProgramRuleAction) => {
    const {
        data,
        programRuleActionType: type,
        dataElementId,
        trackedEntityAttributeId,
        content,
    } = action;

    const actions = [];

    const pushAction = (values) => {
        actions.push(new RuleActionJs(data, type, values));
    };

    if (dataElementId) {
        pushAction(new Map([
            ['field', dataElementId],
            ['attributeType', attributeTypes.DATA_ELEMENT],
        ]));
    }
    if (trackedEntityAttributeId) {
        pushAction(new Map([
            ['field', trackedEntityAttributeId],
            ['attributeType', attributeTypes.TRACKED_ENTITY_ATTRIBUTE],
        ]));
    }
    if (content) {
        pushAction(new Map([
            ['content', content],
            ['attributeType', attributeTypes.UNKNOWN],
        ]));
    }

    return actions;
};

const convertProgramRuleAction = (action: ProgramRuleAction) => {
    if (action.programRuleActionType === effectActions.ASSIGN_VALUE) {
        return convertAssignAction(action);
    }

    const {
        data,
        programRuleActionType: type,
        ...rest
    } = action;

    return new RuleActionJs(
        data,
        type,
        new Map(Object.keys(rest).map(key => [key, rest[key]])),
    );
};

const convertProgramRule = (rule: ProgramRule) => {
    const {
        condition,
        programRuleActions,
        id: uid,
        name,
        programStageId: programStage,
        priority,
    } = rule;

    return new RuleJs(
        condition,
        programRuleActions.flatMap(convertProgramRuleAction),
        uid,
        name,
        programStage,
        priority,
    );
};

const ruleValueTypeMap = {
    [typeKeys.BOOLEAN]: RuleValueType.BOOLEAN,
    [typeKeys.TRUE_ONLY]: RuleValueType.BOOLEAN,
    [typeKeys.DATE]: RuleValueType.DATE,
    [typeKeys.DATETIME]: RuleValueType.DATE,
    [typeKeys.AGE]: RuleValueType.DATE,
    [typeKeys.INTEGER]: RuleValueType.NUMERIC,
    [typeKeys.INTEGER_POSITIVE]: RuleValueType.NUMERIC,
    [typeKeys.INTEGER_NEGATIVE]: RuleValueType.NUMERIC,
    [typeKeys.INTEGER_ZERO_OR_POSITIVE]: RuleValueType.NUMERIC,
    [typeKeys.NUMBER]: RuleValueType.NUMERIC,
    [typeKeys.PERCENTAGE]: RuleValueType.NUMERIC,
};

const convertRuleVariable = (variable: ProgramRuleVariable, optionSets: KotlinOptionSets) => {
    const {
        programRuleVariableSourceType: type,
        displayName: name,
        useNameForOptionSet,
        valueType: fieldType,
        programStageId: programStage,
    } = variable;

    const field = programRuleVariableSourceIdExtractor[type](variable);

    return new RuleVariableJs(
        RuleVariableType[type],
        name,
        !useNameForOptionSet,
        optionSets[field] || [],
        field,
        ruleValueTypeMap[fieldType] || RuleValueType.TEXT,
        programStage,
    );
};

const convertConstants = (constants: Constants): Map<string, string> =>
    constants.reduce((acc, constant) => {
        acc.set(constant.displayName, constant.value);
        return acc;
    }, new Map);

const convertOption = (option: Option): KotlinOption =>
    ({ name: option.displayName, code: option.code });

const buildSupplementaryData = ({
    selectedOrgUnit,
    selectedUserRoles,
}: {
    selectedOrgUnit: OrgUnit,
    selectedUserRoles: ?Array<string>,
}) => {
    const orgUnitId = selectedOrgUnit.id;
    const supplementaryData = selectedOrgUnit.groups.reduce(
        (acc, group) => {
            if (group.code) {
                acc.set(group.code, [orgUnitId]);
            }
            acc.set(group.id, [orgUnitId]);
            return acc;
        },
        new Map<string, Array<string>>(),
    );

    if (selectedUserRoles) {
        supplementaryData.set('USER', selectedUserRoles);
    }

    return supplementaryData;
};

export class InputBuilder {
    processValue: (value: any, type: $Values<typeof typeKeys>) => any;
    dataElements: DataElements;
    trackedEntityAttributes: TrackedEntityAttributes;
    selectedOrgUnit: OrgUnit;
    constructor(
        inputConverter: IConvertInputRulesValue,
        dataElements: ?DataElements,
        trackedEntityAttributes: ?TrackedEntityAttributes,
        selectedOrgUnit: OrgUnit,
    ) {
        this.processValue = new ValueProcessor(inputConverter).processValue;
        this.dataElements = dataElements || {};
        this.trackedEntityAttributes = trackedEntityAttributes || {};
        this.selectedOrgUnit = selectedOrgUnit;
    }

    convertDataElementValue = (id: string, rawValue: any) =>
        String(this.dataElements[id]
            ? this.processValue(rawValue, this.dataElements[id].valueType)
            : rawValue);

    convertTrackedEntityAttributeValue = (id: string, rawValue: any) =>
        String(this.trackedEntityAttributes[id]
            ? this.processValue(rawValue, this.trackedEntityAttributes[id].valueType)
            : rawValue);

    convertEvent = (eventData: EventData) => {
        const {
            eventId: event,
            programStageId: programStage,
            programStageName,
            status,
            occurredAt,
            scheduledAt: dueDate,
            completedAt: completedDate,
        } = eventData;

        const eventDate = occurredAt ? Instant.parse(occurredAt) : Instant.now();

        const dataValues = Object
            .keys(eventData)
            .filter(key => !eventMainKeys.has(key))
            .map(key =>
                new RuleDataValueJs(
                    eventDate,
                    programStage,
                    key,
                    this.convertDataElementValue(key, eventData[key]),
                ));

        const toLocalDate = (dateString: ?string) =>
            (dateString ? LocalDate.parse(this.processValue(dateString, typeKeys.DATE)) : null);

        return new RuleEventJs(
            event,
            programStage,
            programStageName,
            status ? RuleEventStatus[status] : RuleEventStatus.ACTIVE,
            eventDate,
            toLocalDate(dueDate),
            toLocalDate(completedDate),
            this.selectedOrgUnit.id,
            this.selectedOrgUnit.code,
            dataValues,
        );
    };

    buildEnrollment = ({
        selectedEnrollment,
        selectedEntity,
    }: {
        selectedEnrollment: Enrollment,
        selectedEntity: TEIValues,
    }) => {
        const {
            enrollmentId: enrollment,
            enrolledAt: enrollmentDate,
            occurredAt: incidentDate,
        } = selectedEnrollment;

        const attributeValues = Object
            .keys(selectedEntity)
            .map(key => new RuleAttributeValue(
                key,
                this.convertTrackedEntityAttributeValue(key, selectedEntity[key]),
            ));

        // TODO:
        // `programName` and `enrollmentStatus` are program indicator specific variables,
        // but since Capture supports program indicators, these should be added as part
        // of `Enrollment`.

        const toLocalDate = (dateString: ?string) =>
            (dateString ? LocalDate.parse(this.processValue(dateString, typeKeys.DATE)) : LocalDate.now());

        return new RuleEnrollmentJs(
            enrollment,
            '',                  // programName placeholder value
            toLocalDate(incidentDate),
            toLocalDate(enrollmentDate),
            RuleEnrollmentStatus.ACTIVE,            // enrollmentStatus placeholder value
            this.selectedOrgUnit.id,
            this.selectedOrgUnit.code,
            attributeValues,
        );
    };

    buildRuleEngineContext = ({
        programRulesContainer,
        selectedUserRoles,
        optionSets,
    }: {
        programRulesContainer: ProgramRulesContainer,
        selectedUserRoles: ?Array<string>,
        optionSets: OptionSets,
    }) => {
        const { programRules, programRuleVariables, constants } = programRulesContainer;

        const kotlinOptionSets = Object.keys(optionSets).reduce((acc, key) => {
            acc[key] = optionSets[key].options.map(convertOption);
            return acc;
        }, {});

        return new RuleEngineContextJs(
            programRules && programRules.map(convertProgramRule),
            programRuleVariables && programRuleVariables.map(variable => convertRuleVariable(variable, kotlinOptionSets)),
            buildSupplementaryData({ selectedOrgUnit: this.selectedOrgUnit, selectedUserRoles }),
            constants && convertConstants(constants),
        );
    };
}
