// @flow
import * as React from 'react';

import { LoadingMaskElementCenter } from '../components/LoadingMasks';

type Props = {
  ready?: ?boolean,
};

const withLoadingIndicator = (
  getContainerStylesFn?: ?(props: any) => Object,
  getIndicatorProps?: ?(props: any) => Object,
  readyFn?: (props: any) => boolean,
) => (InnerComponent: React.ComponentType<any>) => (props: Props) => {
  const { ready, ...other } = props;
  const isReady = readyFn ? readyFn(props) : ready;
  if (!isReady) {
    const containerStyles = getContainerStylesFn ? getContainerStylesFn(props) : null;
    const indicatorProps = getIndicatorProps ? getIndicatorProps(props) : null;
    return <LoadingMaskElementCenter containerStyle={containerStyles} {...indicatorProps} />;
  }

  return <InnerComponent {...other} />;
};

export default withLoadingIndicator;
