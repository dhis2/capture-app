import { FEATURES, featureAvailable } from 'capture-core-utils/featuresSupport';
import { quickStore } from '../../IOUtils';
import { getContext } from '../../context';

const convert = (() => {
    const getTrackedEntityTypeAttribute = (trackedEntityTypeAttribute) => {
        const { trackedEntityAttribute, ...restAttribute } = trackedEntityTypeAttribute;
        const trackedEntityAttributeId = trackedEntityAttribute.id;

        return {
            ...restAttribute,
            trackedEntityAttributeId,
        };
    };

    const getTrackedEntityTypeAttributes = trackedEntityTypeAttributes =>
        (trackedEntityTypeAttributes || [])
            .filter(({ trackedEntityAttribute }) => trackedEntityAttribute?.id)
            .map(trackedEntityTypeAttribute => getTrackedEntityTypeAttribute(trackedEntityTypeAttribute));

    return response =>
        ((response && response.trackedEntityTypes) || [])
            .map(trackedEntityType => ({
                ...trackedEntityType,
                trackedEntityTypeAttributes:
                    getTrackedEntityTypeAttributes(trackedEntityType.trackedEntityTypeAttributes),
            }));
})();

const buildFieldsParam = (includePluralLabels: boolean): string => {
    const labels = includePluralLabels ? 'displayName,displayTrackedEntityTypesLabel' : 'displayName';
    return `id,access,${labels},minAttributesRequiredToSearch,featureType,` +
        'trackedEntityTypeAttributes[trackedEntityAttribute[id],displayInList,mandatory,searchable],' +
        'translations[property,locale,value]';
};

export const storeTrackedEntityTypes = (ids: Array<string>) => {
    const includePluralLabels = featureAvailable(FEATURES.customTerminologyPlurals);
    const query = {
        resource: 'trackedEntityTypes',
        params: {
            fields: buildFieldsParam(includePluralLabels),
            filter: `id:in:[${ids.join(',')}]`,
            pageSize: ids.length,
        },
    };

    return quickStore({
        query,
        storeName: getContext().storeNames.TRACKED_ENTITY_TYPES,
        convertQueryResponse: convert,
    });
};
