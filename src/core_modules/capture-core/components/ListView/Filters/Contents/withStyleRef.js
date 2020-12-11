// @flow
import * as React from 'react';

type Props = {
  filterTypeRef: (instance: any) => void,
};

export default () => (InnerComponent: React.ComponentType<any>) => (props: Props) => (
  // $FlowFixMe[cannot-spread-inexact] automated comment
  <InnerComponent innerRef={props.filterTypeRef} {...props} />
);
