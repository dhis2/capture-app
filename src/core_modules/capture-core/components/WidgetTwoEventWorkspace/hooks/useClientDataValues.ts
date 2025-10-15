import { useConfig, useDataEngine } from '@dhis2/app-runtime';
import { useQuery } from 'react-query';
import { buildUrl, pipe } from 'capture-core-utils';
import type { RenderFoundation } from '../../../metaData';
import { convertClientToView, convertServerToClient } from '../../../converters';
import { subValueGetterByElementType } from '../utils/getSubValueForDataValue';
import { makeQuerySingleResource } from '../../../utils/api';

type Props = {
    linkedEventId?: string | null;
    dataValues: Array<{ dataElement: string; value: any }>;
    formFoundation?: RenderFoundation | null;
};

const convertFn = pipe(convertServerToClient, convertClientToView);

const formatDataValues = async (
    dataValues: Array<{ dataElement: string; value: any }>,
    formFoundation: RenderFoundation,
    querySingleResource: any,
    linkedEventId: string,
    absoluteApiPath: string,
) => {
    const elements = formFoundation.getElements();

    const formattedDataValues = dataValues.map(async (dataValue) => {
        const element = elements.find(({ id }) => id === dataValue.dataElement);
        if (!element) {
            return null;
        }

        let value = dataValue.value;
        if (subValueGetterByElementType[element.type]) {
            value = await subValueGetterByElementType[element.type]({
                dataElement: {
                    id: element.id,
                    value: dataValue.value,
                },
                querySingleResource,
                eventId: linkedEventId,
                absoluteApiPath,
            });
        }

        return {
            id: element.id,
            value: convertFn(value, element.type, element),
        };
    });

    const resolvedDataValues = await Promise.all(formattedDataValues);
    return resolvedDataValues.reduce((acc, dataValue) => {
        if (dataValue) {
            acc[dataValue.id] = dataValue.value;
        }
        return acc;
    }, {} as Record<string, any>);
};

export const useClientDataValues = ({
    linkedEventId,
    dataValues,
    formFoundation,
}: Props) => {
    const dataEngine = useDataEngine();
    const { baseUrl, apiVersion } = useConfig();
    const querySingleResource = makeQuerySingleResource(dataEngine.query.bind(dataEngine));
    const { data: clientValuesWithSubValues, isError, isLoading } = useQuery(
        ['formattedDataValues', linkedEventId, dataValues],
        () => formatDataValues(
            dataValues,
            formFoundation as RenderFoundation,
            querySingleResource,
            linkedEventId as string,
            buildUrl(baseUrl, `api/${apiVersion}`),
        ),
        {
            enabled: !!dataValues &&
                !!formFoundation &&
                !!linkedEventId &&
                !!baseUrl &&
                !!apiVersion &&
                !!querySingleResource,
        },
    );

    return {
        clientValuesWithSubValues,
        isError,
        isLoading,
    };
};
