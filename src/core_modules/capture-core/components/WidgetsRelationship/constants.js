// @flow
import i18n from '@dhis2/d2-i18n';
import { dataElementTypes } from '../../metaData';
import { convertClientToList, convertServerToClient } from '../../converters';

export const relationshipEntities = Object.freeze({
    TRACKED_ENTITY_INSTANCE: 'TRACKED_ENTITY_INSTANCE',
    PROGRAM_STAGE_INSTANCE: 'PROGRAM_STAGE_INSTANCE',
    PROGRAM_INSTANCE: 'PROGRAM_INSTANCE',
});

export const getBaseConfigHeaders = {
    [relationshipEntities.TRACKED_ENTITY_INSTANCE]: [{
        id: 'tetName',
        displayName: i18n.t('TET name'),
        convertValue: (props: any) => props.trackedEntityTypeName,
    }, {
        id: 'createdDate',
        displayName: i18n.t('Created date'),
        convertValue: (props: any) => convertClientToList(
            convertServerToClient(props.created, dataElementTypes.DATE), dataElementTypes.DATE,
        ),
    }],
    [relationshipEntities.PROGRAM_STAGE_INSTANCE]: [{
        id: 'programStageName',
        displayName: i18n.t('Program stage name'),
        convertValue: (props: any) => props.programStageName,
    },
    {
        id: 'createdDate',
        displayName: i18n.t('Created date'),
        convertValue: (props: any) => convertClientToList(
            convertServerToClient(props.created, dataElementTypes.DATE), dataElementTypes.DATE,
        ),
    }],
    [relationshipEntities.PROGRAM_INSTANCE]: [{
        id: 'createdDate',
        displayName: i18n.t('Created date'),
        convertValue: (props: any) => convertClientToList(
            convertServerToClient(props.created, dataElementTypes.DATE), dataElementTypes.DATE,
        ),
    }],
};

export const RELATIONSHIP_ENTITIES: {|
    PROGRAM_STAGE_INSTANCE: 'PROGRAM_STAGE_INSTANCE',
    TRACKED_ENTITY_INSTANCE: 'TRACKED_ENTITY_INSTANCE',
    PROGRAM_INSTANCE: 'PROGRAM_INSTANCE',
|} = Object.freeze({
    PROGRAM_STAGE_INSTANCE: 'PROGRAM_STAGE_INSTANCE',
    TRACKED_ENTITY_INSTANCE: 'TRACKED_ENTITY_INSTANCE',
    PROGRAM_INSTANCE: 'PROGRAM_INSTANCE',
});
