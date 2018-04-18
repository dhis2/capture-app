// @flow
import './table.css';

import type { Adapter, ComponentCreators } from './types';

const getComponentsUnordered =
    ({ componentCreators }: { componentCreators: ComponentCreators }) =>
        Object
            .keys(componentCreators)
            .reduce((accComponents, creatorName) => {
                accComponents[creatorName] = componentCreators[creatorName]();
                return accComponents;
            }, {});

const getComponentsOrdered =
    ({ componentCreators, creationOrder }: { componentCreators: ComponentCreators, creationOrder: Array<string> }) =>
        creationOrder
            .reduce((accComponents, creatorName) => {
                accComponents[creatorName] =
                    componentCreators[creatorName](accComponents);
                return accComponents;
            }, {});

const getTableComponents = (adapter: Adapter) => {
    const components = adapter.creationOrder ?
        getComponentsOrdered(adapter) :
        getComponentsUnordered(adapter);
    return components;
};

export default getTableComponents;
