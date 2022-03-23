
import moment from 'moment';
import i18n from '@dhis2/d2-i18n';

export const relationshipEntities = Object.freeze({
    TRACKED_ENTITY_INSTANCE: 'TRACKED_ENTITY_INSTANCE',
    PROGRAM_STAGE_INSTANCE: 'PROGRAM_STAGE_INSTANCE',
    PROGRAM_INSTANCE: 'PROGRAM_INSTANCE',
});

export const relationshipWidgetTypes = Object.freeze({
    TET_RELATIONSHIP: 'TET_RELATIONSHIP',
    ENROLLMENT_RELATIONSHIP: 'ENROLLMENT_RELATIONSHIP',
    EVENT_RELATIONSHIP: 'EVENT_RELATIONSHIP',
});

// this will change after https://jira.dhis2.org/browse/DHIS2-12249 is done
export const getDisplayFieldsFromAPI = {
    [relationshipEntities.TRACKED_ENTITY_INSTANCE]: [
        { id: 'w75KJ2mc4zz', label: 'First name' },
        { id: 'zDhUuAYrxNC', label: 'Last name' },
    ],
    [relationshipEntities.PROGRAM_STAGE_INSTANCE]: [
        { id: 'orgUnitName', label: 'Organisation unit' },
        { id: 'program',
            label: 'Program',
            convertValue: props => props?.programName,
        },
        { id: 'eventDate',
            label: 'Event date',
            convertValue: props => moment(props.eventDate).format('YYYY-MM-DD'),
        },
        { id: 'status', label: 'Status' },
    ],
    [relationshipEntities.PROGRAM_INSTANCE]: [
        { id: 'orgUnitName', label: 'Organisation unit' },
        { id: 'enrollmentDate',
            label: 'Enrollment date',
            convertValue: props => moment(props.enrollmentDate).format('YYYY-MM-DD'),
        },
    ],
};

export const getBaseConfigHeaders = {
    [relationshipEntities.TRACKED_ENTITY_INSTANCE]: [{
        id: 'tetName',
        label: i18n.t('TET name'),
        convertValue: props => props.trackedEntityTypeName,
    }, {
        id: 'createdDate',
        label: i18n.t('Created date'),
        convertValue: props => moment(props.created).format('YYYY-MM-DD'),
    }],
    [relationshipEntities.PROGRAM_STAGE_INSTANCE]: [{
        id: 'programStageName',
        label: i18n.t('Program stage name'),
        convertValue: props => props.programStageName,
    },
    {
        id: 'createdDate',
        label: i18n.t('Created date'),
        convertValue: props => moment(props.created).format('YYYY-MM-DD'),
    }],
    [relationshipEntities.PROGRAM_INSTANCE]: [{
        id: 'createdDate',
        label: i18n.t('Created date'),
        convertValue: props => moment(props.created).format('YYYY-MM-DD'),
    }],
};
