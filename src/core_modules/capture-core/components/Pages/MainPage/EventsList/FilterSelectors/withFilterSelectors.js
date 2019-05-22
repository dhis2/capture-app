// @flow
import * as React from 'react';
import getFiltersContainer from './FilterSelectors.containerGetter';

export default () => (InnerComponent: React.ComponentType<any>) => getFiltersContainer(InnerComponent);
