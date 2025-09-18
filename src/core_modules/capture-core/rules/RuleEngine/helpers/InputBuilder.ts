import { Instant, LocalDate } from '@js-joda/core';
import {
    Option,
    RuleActionJs,
    RuleDataValue,
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
    Option as RawOption,
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
    KotlinOptionSet,
    KotlinOptionSets,
} from '../types/kotlinRuleEngine.types';

const variableSourceTypesDataElementSpecific = {
    DATAELEMENT_CURRENT_EVENT: 'DATAELEMENT_CURRENT_EVENT',
    DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE: 'DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE',
    DATAELEMENT_NEWEST_EVENT_PROGRAM: 'DATAELEMENT_NEWEST_EVENT_PROGRAM',
    DATAELEMENT_PREVIOUS_EVENT: 'DATAELEMENT_PREVIOUS_EVENT',
};

const variableSourceTypesTrackedEntitySpecific = {
    TEI_ATTRIBUTE: 'TEI_ATTRIBUTE',
};

export const variableSourceTypes = {
    ...variableSourceTypesDataElementSpecific,
    ...variableSourceTypesTrackedEntitySpecific,
    CALCULATED_VALUE: 'CALCULATED_VALUE',
};

const programRuleVariableSourceIdExtractor = {
    [variableSourceTypes.DATAELEMENT_CURRENT_EVENT]: variable => variable.dataElementId,
    [variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM]: variable => variable.dataElementId,
    [variableSourceTypes.DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE]: variable => variable.dataElementId,
    [variableSourceTypes.DATAELEMENT_PREVIOUS_EVENT]: variable => variable.dataElementId,
    [variableSourceTypes.TEI_ATTRIBUTE]: variable => variable.trackedEntityAttributeId,
    [variableSourceTypes.CALCULATED_VALUE]: () => '',
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
    'createdAt',
    'scheduledAt',
    'completedAt',
]);

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

const convertAssignAction = (action: ProgramRuleAction) => {
    const {
        data,
        programRuleActionType: type,
        dataElementId,
        trackedEntityAttributeId,
        content,
    } = action;

    const actions: Array<RuleActionJs> = [];

    const pushAction = (values: Map<string, string>) => {
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
        displayName: name,
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

const convertConstants = (constants: Constants): Map<string, string> =>
    constants.reduce((acc, constant) => {
        acc.set(constant.displayName, constant.value);
        return acc;
    }, new Map());

const convertOption = (option: RawOption) => new Option(option.displayName, option.code);

const buildSupplementaryData = ({
    selectedOrgUnit,
    selectedUserRoles,
}: {
    selectedOrgUnit: OrgUnit;
    selectedUserRoles?: Array<string> | null;
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

    supplementaryData.set('USER', selectedUserRoles || []);

    return supplementaryData;
};

export class InputBuilder {
    processValue: (value: any, type: typeof typeKeys[keyof typeof typeKeys]) => any;
    dataElements: DataElements;
    trackedEntityAttributes: TrackedEntityAttributes;
    optionSets: OptionSets;
    kotlinOptionSets: KotlinOptionSets;
    selectedOrgUnit: OrgUnit;
    constructor(
        inputConverter: IConvertInputRulesValue,
        dataElements: DataElements | null,
        trackedEntityAttributes: TrackedEntityAttributes | null | undefined,
        optionSets: OptionSets,
        selectedOrgUnit: OrgUnit,
    ) {
        this.processValue = new ValueProcessor(inputConverter).processValue;
        this.dataElements = dataElements || {};
        this.trackedEntityAttributes = trackedEntityAttributes || {};
        this.optionSets = optionSets;
        this.kotlinOptionSets = {};
        this.selectedOrgUnit = selectedOrgUnit;
    }

    toLocalDate = (dateString?: string | null, defaultValue: any = null) =>
        (dateString 
            ? LocalDate.parse(this.processValue(dateString, typeKeys.DATE)) 
            : defaultValue);

    convertDataElementValue = (id: string, rawValue: any) =>
        this.convertDataValue(rawValue, this.dataElements[id]?.valueType);

    convertTrackedEntityAttributeValue = (id: string, rawValue: any) =>
        this.convertDataValue(rawValue, this.trackedEntityAttributes[id]?.valueType);

    convertDataValue = (rawValue: any, valueType: string | null) =>
        String(valueType ? this.processValue(rawValue, valueType) : rawValue);

    convertEvent = (eventData: EventData) => {
        const {
            eventId: event,
            programStageId: programStage,
            programStageName,
            status,
            occurredAt,
            createdAt,
            scheduledAt: dueDate,
            completedAt: completedDate,
        } = eventData;

        const eventDate = occurredAt ? Instant.parse(occurredAt) : null;
        const createdDate = createdAt ? Instant.parse(createdAt) : Instant.now();
        const dataValues = Object
            .keys(eventData)
            .filter(key => !eventMainKeys.has(key))
            .filter(key => (eventData[key] ?? null) !== null)
            .map(key =>
                new RuleDataValue(
                    key,
                    this.convertDataElementValue(key, eventData[key]),
                ));

        return new RuleEventJs(
            event || '',
            programStage || '',
            programStageName || '',
            status ? RuleEventStatus[status] : RuleEventStatus.ACTIVE,
            eventDate,
            createdDate,
            this.toLocalDate(dueDate),
            this.toLocalDate(completedDate),
            this.selectedOrgUnit.id,
            this.selectedOrgUnit.code,
            dataValues,
        );
    };

    convertOptionSet(optionSetId?: string | null): KotlinOptionSet {
        if (!optionSetId || !this.optionSets[optionSetId]) {
            return [];
        }
        if (this.kotlinOptionSets[optionSetId]) {
            return this.kotlinOptionSets[optionSetId];
        }
        this.kotlinOptionSets[optionSetId] = this.optionSets[optionSetId].options.map(convertOption);
        return this.kotlinOptionSets[optionSetId];
    }

    getOptionSet(field: string, type: string): KotlinOptionSet {
        if (variableSourceTypesDataElementSpecific[type]) {
            return this.convertOptionSet(this.dataElements[field]?.optionSetId);
        } else if (variableSourceTypesTrackedEntitySpecific[type]) {
            return this.convertOptionSet(this.trackedEntityAttributes[field]?.optionSetId);
        }
        return [];
    }

    convertRuleVariable = (variable: ProgramRuleVariable) => {
        const {
            programRuleVariableSourceType,
            displayName: name,
            useNameForOptionSet,
            valueType: fieldType,
            programStageId: programStage,
        } = variable;

        const type = programRuleVariableSourceIdExtractor[programRuleVariableSourceType]
            ? programRuleVariableSourceType : 'CALCULATED_VALUE';

        const field = programRuleVariableSourceIdExtractor[type](variable);

        return new RuleVariableJs(
            RuleVariableType[type],
            name,
            !useNameForOptionSet,
            this.getOptionSet(field, type),
            field,
            ruleValueTypeMap[fieldType] || RuleValueType.TEXT,
            programStage,
        );
    };

    buildEnrollment = ({
        selectedEnrollment,
        selectedEntity,
    }: {
        selectedEnrollment: Enrollment;
        selectedEntity?: TEIValues | null;
    }) => {
        const {
            enrollmentId: enrollment,
            enrolledAt: enrollmentDate,
            occurredAt: incidentDate,
            programName,
            enrollmentStatus,
        } = selectedEnrollment;

        const attributeValues = selectedEntity ? Object
            .keys(selectedEntity)
            .filter(key => (selectedEntity[key] ?? null) !== null)
            .map(key => new RuleAttributeValue(
                key,
                this.convertTrackedEntityAttributeValue(key, selectedEntity[key]),
            )) : [];

        const convertDate = (dateString?: string | null) => this.toLocalDate(dateString, LocalDate.now());

        return new RuleEnrollmentJs(
            enrollment!,
            programName || '',
            convertDate(incidentDate),
            convertDate(enrollmentDate),
            enrollmentStatus ? RuleEnrollmentStatus[enrollmentStatus] : RuleEnrollmentStatus.ACTIVE,
            this.selectedOrgUnit.id,
            this.selectedOrgUnit.code,
            attributeValues,
        );
    };

    buildRuleEngineContext = ({
        programRulesContainer,
        selectedUserRoles,
    }: {
        programRulesContainer: ProgramRulesContainer;
        selectedUserRoles?: Array<string> | null;
    }) => {
        const { programRules, programRuleVariables, constants } = programRulesContainer;

        return new RuleEngineContextJs(
            programRules ? programRules.map(convertProgramRule) : [],
            programRuleVariables ? programRuleVariables.map(this.convertRuleVariable) : [],
            buildSupplementaryData({ selectedOrgUnit: this.selectedOrgUnit, selectedUserRoles }),
            constants ? convertConstants(constants) : new Map(),
        );
    };
}
