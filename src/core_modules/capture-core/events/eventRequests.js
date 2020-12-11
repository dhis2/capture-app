// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getApi } from '../d2/d2Instance';
import programCollection from '../metaDataMemoryStores/programCollection/programCollection';
import { convertValue } from '../converters/serverToClient';
import { dataElementTypes } from '../metaData';
import { getSubValues } from './getSubValues';

type ApiDataValue = {
  dataElement: string,
  value: any,
};

type ApiTEIEvent = {
  event: string,
  program: string,
  programStage: string,
  orgUnit: string,
  orgUnitName: string,
  trackedEntityInstance?: string,
  enrollment?: string,
  enrollmentStatus?: string,
  status: string,
  eventDate: string,
  dueDate: string,
  completedDate: string,
  dataValues: Array<ApiDataValue>,
  assignedUser?: ?string,
  assignedUserUsername?: ?string,
  assignedUserDisplayName?: ?string,
};

export type ClientEventContainer = {
  id: string,
  event: CaptureClientEvent,
  values: { [key: string]: any },
};

const errorMessages = {
  PROGRAM_NOT_FOUND: 'Program not found',
  STAGE_NOT_FOUND: 'Stage not found',
};

function getValuesById(apiDataValues: Array<ApiDataValue>) {
  if (!apiDataValues) {
    return apiDataValues;
  }

  return apiDataValues.reduce((accValues, dataValue) => {
    accValues[dataValue.dataElement] = dataValue.value;
    return accValues;
  }, {});
}

const mapEventInputKeyToOutputKey = {
  event: 'eventId',
  program: 'programId',
  programStage: 'programStageId',
  orgUnit: 'orgUnitId',
  trackedEntityInstance: 'trackedEntityInstanceId',
  enrollment: 'enrollmentId',
};

function getConvertedValue(valueToConvert: any, inputKey: string) {
  let convertedValue;
  if (inputKey === 'eventDate' || inputKey === 'dueDate' || inputKey === 'completedDate') {
    convertedValue = convertValue(valueToConvert, dataElementTypes.DATE);
  } else {
    convertedValue = valueToConvert;
  }
  return convertedValue;
}

function getAssignee(apiEvent: ApiTEIEvent) {
  if (!(apiEvent.assignedUserUsername && apiEvent.assignedUser)) {
    return undefined;
  }

  return {
    id: apiEvent.assignedUser,
    username: apiEvent.assignedUserUsername,
    name: apiEvent.assignedUserDisplayName,
  };
}
function convertMainProperties(apiEvent: ApiTEIEvent): CaptureClientEvent {
  const skipProps = [
    'dataValues',
    'assignedUserUsername',
    'assignedUser',
    'assignedUserDisplayName',
  ];

  return Object.keys(apiEvent).reduce((accEvent, inputKey) => {
    if (inputKey === 'assignedUser') {
      const assignee = getAssignee(apiEvent);
      if (assignee) {
        accEvent.assignee = assignee;
      }
    } else if (!skipProps.includes(inputKey)) {
      const valueToConvert = apiEvent[inputKey];
      const convertedValue = getConvertedValue(valueToConvert, inputKey);

      // $FlowFixMe[prop-missing] automated comment
      const outputKey = mapEventInputKeyToOutputKey[inputKey] || inputKey;

      // $FlowFixMe[incompatible-return] automated comment
      accEvent[outputKey] = convertedValue;
    }
    return accEvent;
  }, {});
}

async function convertToClientEvent(event: ApiTEIEvent) {
  const programMetaData = programCollection.get(event.program);
  if (!programMetaData) {
    log.error(
      errorCreator(errorMessages.PROGRAM_NOT_FOUND)({
        fn: 'convertToClientEvent',
        event,
      }),
    );
    return null;
  }

  const stageMetaData = programMetaData.getStage(event.programStage);
  if (!stageMetaData) {
    log.error(
      errorCreator(errorMessages.STAGE_NOT_FOUND)({
        fn: 'convertToClientEvent',
        event,
      }),
    );
    return null;
  }
  const { stageForm } = stageMetaData;

  const dataValuesById = getValuesById(event.dataValues);
  const convertedDataValues = stageForm.convertValues(dataValuesById, convertValue);
  await getSubValues(event.event, stageForm, convertedDataValues);

  const convertedMainProperties = convertMainProperties(event);

  return {
    id: convertedMainProperties.eventId,
    event: convertedMainProperties,
    values: convertedDataValues || {},
  };
}

export async function getEvent(eventId: string): Promise<?ClientEventContainer> {
  const api = getApi();
  const apiRes = await api.get(`events/${eventId}`);

  const eventContainer = await convertToClientEvent(apiRes);
  return eventContainer;
}

export async function getEvents(queryParams: Object) {
  const api = getApi();
  const req = {
    url: 'events',
    queryParams,
  };
  const apiRes = await api.get(req.url, { ...req.queryParams });

  const eventContainers =
    apiRes && apiRes.events
      ? await apiRes.events.reduce(async (accEventsPromise, apiEvent) => {
          const accEvents = await accEventsPromise;
          const eventContainer = await convertToClientEvent(apiEvent);
          if (eventContainer) {
            accEvents.push(eventContainer);
          }
          return accEvents;
        }, Promise.resolve([]))
      : [];

  const pagingData = {
    rowsPerPage: queryParams.pageSize,
    currentPage: queryParams.page,
  };

  return {
    eventContainers,
    pagingData,
    request: req,
  };
}
