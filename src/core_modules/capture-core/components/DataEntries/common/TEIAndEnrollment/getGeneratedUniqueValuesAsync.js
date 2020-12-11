// @flow
import log from 'loglevel';
import { errorCreator, pipe } from 'capture-core-utils';
import moment from 'capture-core-utils/moment/momentResolver';
import { convertServerToClient, convertClientToForm } from '../../../../converters';
import { getApi } from '../../../../d2/d2Instance';
import type { RenderFoundation } from '../../../../metaData';

type StaticPatternValues = {
  orgUnitCode: string,
};

type CacheItem = {
  value: any,
  expires: number,
};

function getExpiryTimeStamp() {
  const expiryMoment = moment().add(3, 'days');
  return expiryMoment.unix();
}

function getFormValue(value: any, type: string) {
  return pipe(convertServerToClient, convertClientToForm)(value, type);
}

async function generateUniqueValueAsync(teaId: string, staticPatternValues: StaticPatternValues) {
  const api = getApi();
  const requiredValues = await api
    .get(`trackedEntityAttributes/${teaId}/requiredValues`)
    .then((response) => response && response.REQUIRED)
    .catch((error) => {
      log.error(
        errorCreator('Could not retrieve required values')({
          teaId,
          error,
        }),
      );
      return null;
    });

  const orgUnitCodeQueryParameter =
    requiredValues && requiredValues.includes('ORG_UNIT_CODE')
      ? {
          ORG_UNIT_CODE: staticPatternValues.orgUnitCode,
        }
      : null;

  const queryParameters = {
    ...orgUnitCodeQueryParameter,
    expiration: '3',
  };

  const generatedValue = await api
    .get(`trackedEntityAttributes/${teaId}/generate`, queryParameters)
    .then((response) => response && response.value)
    .catch((error) => {
      log.error(errorCreator('Could not generate unique id')({ teaId, error }));
      return null;
    });

  return generatedValue;
}

function getActiveUniqueItemFromCache(
  id: string,
  generatedUniqueValuesCache: { [id: string]: CacheItem },
) {
  const cacheItem = generatedUniqueValuesCache[id];
  if (!cacheItem) {
    return null;
  }

  const requiredTimeStamp = moment().add(1, 'days').unix();
  return cacheItem.expires > requiredTimeStamp ? cacheItem : null;
}

export default function getGeneratedUniqueValuesAsync(
  foundation: ?RenderFoundation,
  generatedUniqueValuesCache: Object,
  staticPatternValues: StaticPatternValues,
) {
  if (!foundation) {
    return Promise.resolve([]);
  }

  const itemContainerPromises = foundation
    .getElements()
    .filter((dataElement) => dataElement.unique && dataElement.unique.generatable)
    .map(async (dataElement) => {
      const { id } = dataElement;
      const cacheItem = getActiveUniqueItemFromCache(id, generatedUniqueValuesCache);
      if (cacheItem) {
        return {
          id,
          item: cacheItem,
        };
      }
      return generateUniqueValueAsync(id, staticPatternValues).then((value) => ({
        id,
        item: {
          value: getFormValue(value, dataElement.type),
          expires: getExpiryTimeStamp(),
        },
      }));
    });

  return Promise.all(itemContainerPromises);
}
