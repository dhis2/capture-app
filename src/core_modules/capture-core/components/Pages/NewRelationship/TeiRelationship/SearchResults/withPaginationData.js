// @flow
import * as React from 'react';

const getPaginationData = (InnerComponent: React.ComponentType<any>) => (props: Object) => (
  <InnerComponent {...props} {...props.paging} />
);
export default () => (InnerComponent: React.ComponentType<any>) =>
  getPaginationData(InnerComponent);
