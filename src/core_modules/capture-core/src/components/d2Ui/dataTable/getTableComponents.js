// @flow
/**
 * @module d2-ui/dataTable/getTableComponents
 */

import defaultTableClasses from './table.mod.css';
import type { Adapter, ComponentCreators } from './types';

export type TableClasses = {
    table: string,
    tableRow: string,
    tableRowBody: string,
    tableRowHeader: string,
    tableRowFooter: string,
    tableCell: string,
    tableCellBody: string,
    tableCellHeader: string,
    tableCellFooter: string,
    pagination: string,
    paginationRowsPerPageElementContainer: string,
    paginationRowsPerPageElement: string,
    paginationDisplayRowsContainer: string,
    sortLabelContainer: string,
    sortLabelChildren: string,
    sortLabelChildrenFirst: string,
    sortLabelChildrenLast: string,
    sortLabelRight: string,
    sortLabelIcon: string,
};

/**
 * @param {Adapter} adapter
 * @param {ComponentCreators} [adapter.componentCreators]: the methods for creating the components. The creator methods will get the default css classes passed to them as an argument.
 * @returns {*} components
 */
const getComponentsUnordered =
    ({ componentCreators }: { componentCreators: ComponentCreators }): {[key: string]: any} =>
        Object
            .keys(componentCreators)
            .reduce((accComponents, creatorName) => {
                accComponents[creatorName] = componentCreators[creatorName](defaultTableClasses);
                return accComponents;
            }, {});
/**
 * @param {Adapter} adapter
 * @param {ComponentCreators} [adapter.componentCreators]: the methods for creating the components. The creator methods will get the default css classes passed to them as an argument.
 * @param {array} [adapter.creationOrder]
 * @returns {*} components
 */
const getComponentsOrdered =
    ({ componentCreators, creationOrder }: { componentCreators: ComponentCreators, creationOrder: Array<string> }) =>
        creationOrder
            .reduce((accComponents, creatorName) => {
                accComponents[creatorName] =
                    componentCreators[creatorName](defaultTableClasses, accComponents);
                return accComponents;
            }, {});


/**
 * retrieve the table components specified by the adapter
 * @export
 * @param {Adapter} adapter contains methods for creating the components as well as an optional creation order
 * @returns {*} components
 */
function getTableComponents(adapter: Adapter) {
    const components = adapter.creationOrder ?
        getComponentsOrdered(adapter) :
        getComponentsUnordered(adapter);
    return components;
}

/**
 * @see getTableComponents
 */
export default getTableComponents;
