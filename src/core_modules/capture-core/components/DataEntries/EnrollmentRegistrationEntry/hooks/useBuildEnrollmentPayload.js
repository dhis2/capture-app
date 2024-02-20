// @flow
import { useSelector } from 'react-redux';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';
import {
    getTrackerProgramThrowIfNotFound,
    Section,
} from '../../../../metaData';
import type { RenderFoundation } from '../../../../metaData';
import { convertClientToServer, convertFormToClient } from '../../../../converters';
import {
    convertDataEntryValuesToClientValues,
} from '../../../DataEntry/common/convertDataEntryValuesToClientValues';
import { capitalizeFirstLetter } from '../../../../../capture-core-utils/string';
import { generateUID } from '../../../../utils/uid/generateUID';
import {
    useBuildFirstStageRegistration,
} from './useBuildFirstStageRegistration';
import {
    useMetadataForRegistrationForm,
} from '../../common/TEIAndEnrollment/useMetadataForRegistrationForm';
import {
    useMergeFormFoundationsIfApplicable,
} from './useMergeFormFoundationsIfApplicable';
import {
    deriveAutoGenerateEvents,
    deriveFirstStageDuringRegistrationEvent,
} from '../../../Pages/New/RegistrationDataEntry/helpers';
import { FEATURETYPE } from '../../../../constants';
import type { EnrollmentPayload } from '../EnrollmentRegistrationEntry.types';

type DataEntryReduxConverterProps = {
    programId: string;
    dataEntryId: string;
    itemId?: string;
    orgUnitId: string;
    teiId: ?string;
    trackedEntityTypeId: string;
};

function getClientValuesForFormData(formValues: Object, formFoundation: RenderFoundation) {
    const clientValues = formFoundation.convertValues(formValues, convertFormToClient);
    return clientValues;
}

function getServerValuesForMainValues(
    values: Object,
    meta: Object,
    formFoundation: RenderFoundation,
) {
    const clientValues = convertDataEntryValuesToClientValues(
        values,
        meta,
        formFoundation,
    ) || {};

    // potientally run this through a server to client converter for enrollment, the same way as for event
    const serverValues = Object
        .keys(clientValues)
        .reduce((acc, key) => {
            const value = clientValues[key];
            const type = meta[key].type;
            acc[key] = convertClientToServer(value, type);
            return acc;
        }, {});

    return serverValues;
}

function getPossibleTetFeatureTypeKey(serverValues: Object) {
    return Object
        .keys(serverValues)
        .find(key => key.startsWith('FEATURETYPE_'));
}

function buildGeometryProp(key: string, serverValues: Object) {
    if (!serverValues[key]) {
        return undefined;
    }
    const type = capitalizeFirstLetter(key.replace('FEATURETYPE_', '').toLocaleLowerCase());
    return {
        type,
        coordinates: serverValues[key],
    };
}

const geometryType = formValuesKey => Object.values(FEATURETYPE).find(geometryKey => geometryKey === formValuesKey);

const deriveAttributesFromFormValues = (formValues = {}) =>
    Object.keys(formValues)
        .filter(key => !geometryType(key))
        .map<{ attribute: string, value: ?any }>(key => ({ attribute: key, value: formValues[key] }));

export const useBuildEnrollmentPayload = ({
    programId,
    dataEntryId,
    itemId = 'newEnrollment',
    orgUnitId,
    teiId,
    trackedEntityTypeId,
}: DataEntryReduxConverterProps) => {
    const dataEntryKey = getDataEntryKey(dataEntryId, itemId);
    const formValues = useSelector(({ formsValues }) => formsValues[dataEntryKey]);
    const dataEntryFieldValues = useSelector(({ dataEntriesFieldsValue }) => dataEntriesFieldsValue[dataEntryKey]);
    const dataEntryFieldsMeta = useSelector(({ dataEntriesFieldsMeta }) => dataEntriesFieldsMeta[dataEntryKey]);
    const { formFoundation: scopeFormFoundation } = useMetadataForRegistrationForm({ selectedScopeId: programId });
    const { firstStageMetaData } = useBuildFirstStageRegistration(programId);
    const { formFoundation } = useMergeFormFoundationsIfApplicable(scopeFormFoundation, firstStageMetaData);

    const buildTeiWithEnrollment = (): EnrollmentPayload => {
        if (!formFoundation) throw Error('form foundation object not found');
        const firstStage = firstStageMetaData && firstStageMetaData.stage;
        const clientValues = getClientValuesForFormData(formValues, formFoundation);
        const serverValuesForFormValues = formFoundation.convertAndGroupBySection(clientValues, convertClientToServer);
        const serverValuesForMainValues = getServerValuesForMainValues(
            dataEntryFieldValues,
            dataEntryFieldsMeta,
            formFoundation,
        );
        const { enrolledAt, occurredAt, assignee } = serverValuesForMainValues;

        const { stages } = getTrackerProgramThrowIfNotFound(programId);

        const attributeCategoryOptionsId = 'attributeCategoryOptions';
        const attributeCategoryOptions = Object.keys(serverValuesForMainValues)
            .filter(key => key.startsWith(attributeCategoryOptionsId))
            .reduce((acc, key) => {
                const categoryId = key.split('-')[1];
                acc[categoryId] = serverValuesForMainValues[key];
                return acc;
            }, {});

        const formServerValues = serverValuesForFormValues[Section.groups.ENROLLMENT];
        const currentEventValues = serverValuesForFormValues[Section.groups.EVENT];


        const firstStageDuringRegistrationEvent = deriveFirstStageDuringRegistrationEvent({
            firstStageMetadata: firstStage,
            programId,
            orgUnitId,
            currentEventValues,
            fieldsValue: dataEntryFieldValues,
            attributeCategoryOptions,
            assignee,
        });

        const autoGenerateEvents = deriveAutoGenerateEvents({
            firstStageMetadata: firstStage,
            stages,
            enrolledAt,
            occurredAt,
            programId,
            orgUnitId,
            attributeCategoryOptions,
        });

        const allEventsToBeCreated = firstStageDuringRegistrationEvent
            ? [firstStageDuringRegistrationEvent, ...autoGenerateEvents]
            : autoGenerateEvents;

        const attributes = deriveAttributesFromFormValues(formServerValues);

        const enrollment = {
            program: programId,
            status: 'ACTIVE',
            orgUnit: orgUnitId,
            occurredAt,
            enrolledAt,
            attributes,
            events: allEventsToBeCreated,
        };

        const tetFeatureTypeKey = getPossibleTetFeatureTypeKey(serverValuesForFormValues);
        let geometry;
        if (tetFeatureTypeKey) {
            geometry = buildGeometryProp(tetFeatureTypeKey, serverValuesForFormValues);
            delete serverValuesForFormValues[tetFeatureTypeKey];
        }

        return {
            trackedEntity: teiId || generateUID(),
            orgUnit: orgUnitId,
            trackedEntityType: trackedEntityTypeId,
            attributes,
            geometry,
            enrollments: [enrollment],
        };
    };

    return {
        buildTeiWithEnrollment,
    };
};
