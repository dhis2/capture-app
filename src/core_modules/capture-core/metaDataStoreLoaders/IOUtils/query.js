// @flow
import { getContext } from '../context';
import type { ApiQueryExtended } from './IOUtils.types';

export const query = async (querySpecification: ApiQueryExtended, variables: Object) => {
  const { onQueryApi } = getContext();
  const externalQuery = {
    [querySpecification.resource]: querySpecification,
  };
  const response = await onQueryApi(externalQuery, { variables });
  return response[querySpecification.resource];
};
