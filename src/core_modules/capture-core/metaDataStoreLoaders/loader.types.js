// @flow

export type ApiQueries = {
  [resource: string]: {
    id?: string,
    data?: Object | ((variables: Object) => Object),
    params?: Object | ((variables: Object) => Object),
  },
};

type ApiQueryOptions = {
  variables: Object,
};

export type QueryApiFn = (queries: ApiQueries, options: ApiQueryOptions) => Promise<any>;
