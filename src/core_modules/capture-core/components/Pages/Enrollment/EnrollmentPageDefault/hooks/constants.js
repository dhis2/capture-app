
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

export const getBaseConfigHeaders = {
    [relationshipEntities.TRACKED_ENTITY_INSTANCE]: [{
        id: 'tetName',
        displayName: i18n.t('TET name'),
        convertValue: props => props.trackedEntityTypeName,
    }, {
        id: 'createdDate',
        displayName: i18n.t('Created date'),
        convertValue: props => moment(props.created).format('YYYY-MM-DD'),
    }],
    [relationshipEntities.PROGRAM_STAGE_INSTANCE]: [{
        id: 'programStageName',
        displayName: i18n.t('Program stage name'),
        convertValue: props => props.programStageName,
    },
    {
        id: 'createdDate',
        displayName: i18n.t('Created date'),
        convertValue: props => moment(props.created).format('YYYY-MM-DD'),
    }],
    [relationshipEntities.PROGRAM_INSTANCE]: [{
        id: 'createdDate',
        displayName: i18n.t('Created date'),
        convertValue: props => moment(props.created).format('YYYY-MM-DD'),
    }],
};
