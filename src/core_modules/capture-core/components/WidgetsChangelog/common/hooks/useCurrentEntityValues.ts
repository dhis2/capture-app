import { useApiDataQuery } from '../../../../utils/reactQueryHelpers';
import { CHANGELOG_ENTITY_TYPES, QUERY_KEYS_BY_ENTITY_TYPE } from '../Changelog/Changelog.constants';

type Props = {
    entityId: string;
    entityType: typeof CHANGELOG_ENTITY_TYPES[keyof typeof CHANGELOG_ENTITY_TYPES];
    programId?: string;
};

export type CurrentValues = Record<string, any>;

const FIELDS_BY_ENTITY_TYPE = Object.freeze({
    [CHANGELOG_ENTITY_TYPES.EVENT]: 'dataValues[dataElement,value]',
    [CHANGELOG_ENTITY_TYPES.TRACKED_ENTITY]: 'attributes[attribute,value]',
});

const NO_VALUES: CurrentValues = Object.freeze({});

export const useCurrentEntityValues = ({ entityId, entityType, programId }: Props) => {
    const { data, isInitialLoading } = useApiDataQuery<CurrentValues>(
        ['changelog', entityType, entityId, 'currentValues', { programId }],
        {
            resource: `tracker/${QUERY_KEYS_BY_ENTITY_TYPE[entityType]}/${entityId}`,
            params: {
                program: programId,
                fields: FIELDS_BY_ENTITY_TYPE[entityType],
            },
        },
        {
            enabled: !!entityId,
            select: (response: any) => {
                const items = entityType === CHANGELOG_ENTITY_TYPES.EVENT
                    ? response?.dataValues
                    : response?.attributes;
                return (items ?? []).reduce((acc, { dataElement, attribute, value }) => {
                    acc[dataElement ?? attribute] = value;
                    return acc;
                }, {});
            },
        },
    );

    return {
        currentValues: data ?? NO_VALUES,
        isLoading: isInitialLoading,
    };
};
