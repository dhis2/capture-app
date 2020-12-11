// @flow
import * as React from 'react';
import log from 'loglevel';
import { withStyles } from '@material-ui/core/styles';
import { errorCreator } from 'capture-core-utils';
import FilterButton from './FilterButton/FilterButton.container';
import FilterRestMenu from './FilterRestMenu/FilterRestMenu.component';
import { filterTypesArray } from './filterTypes';
import type { Column } from '../eventList.types';

const getStyles = (theme: Theme) => ({
    filterButtonContainer: {
        paddingRight: theme.typography.pxToRem(theme.spacing.unit),
        paddingBottom: theme.typography.pxToRem(theme.spacing.unit / 2),
        paddingTop: theme.typography.pxToRem(theme.spacing.unit / 2),
    },
});

type Props = {
    columns: ?Array<Column>,
    stickyFilters: { userSelectedFilters: ?Object, filtersWithValueOnInit: ?Object },
    listId: string,
    onRestMenuItemSelected: Function,
    classes: Object,
};

const getValidElementConfigsVisiblePrioritized = (columns: Array<Column>) =>
    new Map(
        columns
            .filter(col => filterTypesArray.includes(col.type))
            .map((element, index) => ({
                element,
                index,
            }))
            .sort((a, b) => {
                const aVisibility = !!a.element.visible;
                const bVisibility = !!b.element.visible;

                if (aVisibility === bVisibility) {
                    return a.index - b.index;
                }

                if (aVisibility) {
                    return -1;
                }

                return 1;
            })
            .map(container => [container.element.id, container.element]),
    );

const splitBasedOnHasValueOnInit =
    (elementConfigs: Map<string, Column>, filtersWithValueOnInit: ?Object) => {
        const filtersNotEmpty = filtersWithValueOnInit || {};
        return Object
            .keys(filtersNotEmpty)
            .reduce((acc, key) => {
                const config = elementConfigs.get(key);

                if (!config) {
                    log.error(
                        errorCreator('a filter with no config element was found')({
                            key,
                            value: filtersNotEmpty[key],
                        }),
                    );
                    return acc;
                }

                acc.initValueElements.set(key, config);
                acc.remainingElements.delete(key);
                return acc;
            }, {
                initValueElements: new Map(),
                remainingElements: new Map(elementConfigs.entries()),
            });
    };

const fillUpIndividualElements = (
    elementConfigs: Map<string, Column>,
    occupiedSpots: number,
) => {
    const INDIVIDUAL_DISPLAY_COUNT_BASE = 4;

    const fillUpElements = new Map();
    const availableSpots = INDIVIDUAL_DISPLAY_COUNT_BASE - occupiedSpots;

    for (let index = 0; elementConfigs.size > 0 && index < availableSpots; index++) {
        // $FlowFixMe
        const [key, value] = elementConfigs.entries().next().value;
        fillUpElements.set(key, value);
        elementConfigs.delete(key);
    }

    return {
        fillUpElements,
        remainingElements: elementConfigs,
    };
};

const getUserSelectedElements = (
    elementConfigs: Map<string, Column>,
    userSelectedFilters: ?Object,
) => {
    const userSelectedFiltersNonEmpty = userSelectedFilters || {};

    return Object
        .keys(userSelectedFiltersNonEmpty)
        .reduce((acc, key) => {
            const config = elementConfigs.get(key);
            if (!config) {
                log.error(
                    errorCreator('a userSelectedFilter was specified but no config element was found')({
                        key,
                    }),
                );
                return acc;
            }
            acc.userSelectedElements.set(key, config);
            acc.remainingElements.delete(key);
            return acc;
        }, {
            userSelectedElements: new Map(),
            remainingElements: elementConfigs,
        });
};

const getIndividualElementsArray = (
    validElementConfigs: Map<string, Column>,
    initValueElements: Map<string, Column>,
    fillUpElements: Map<string, Column>,
    userSelectedElements: Map<string, Column>,
): Array<Column> => [...validElementConfigs.entries()]
    .map(entry => entry[1])
    .map((element) => {
        if (initValueElements.has(element.id) ||
            fillUpElements.has(element.id) ||
            userSelectedElements.has(element.id)) {
            return element;
        }
        // $FlowFixMe
        return undefined;
    })
    .filter(element => element);

const renderIndividualFilterButtons = (
    individualElementsArray: Array<Column>,
    visibleSelectorId: ?string,
    onSetVisibleSelector: Function,
    listId: string,
    classes: Object,
) => individualElementsArray
    .map(
        element => (
            <div
                key={element.id}
                data-test={`filter-button-container-${element.id}`}
                className={classes.filterButtonContainer}
            >
                <FilterButton
                    data-test={`filter-button-${element.id}`}
                    listId={listId}
                    itemId={element.id}
                    type={element.type}
                    title={element.header}
                    optionSet={element.optionSet}
                    singleSelect={element.singleSelect}
                    onSetVisibleSelector={onSetVisibleSelector}
                    isSelectorVisible={element.id === visibleSelectorId}
                />
            </div>
        ),
    );

const renderRestButton = (
    restElementsArray: Array<Column>,
    listId: string,
    onRestMenuItemSelected: Function,
) => (restElementsArray.length > 0 ? (
    <FilterRestMenu
        key="restMenu"
        data-test="filter-rest-menu"
        listId={listId}
        columns={restElementsArray}
        onItemSelected={onRestMenuItemSelected}
    />
) : null);


const Filters = (props: Props) => {
    const {
        columns,
        stickyFilters,
        listId,
        onRestMenuItemSelected,
        classes,
    } = props;

    const [visibleSelectorId, setVisibleSelector] = React.useState(undefined);

    const elementsContainer = React.useMemo(() => {
        const notEmptyColumns = columns || [];
        const validElementConfigs = getValidElementConfigsVisiblePrioritized(notEmptyColumns);

        const { initValueElements, remainingElements: remainingElementsAfterInitSplit } =
            splitBasedOnHasValueOnInit(validElementConfigs, stickyFilters.filtersWithValueOnInit);

        const { fillUpElements, remainingElements: remainingElementsAfterFillUp } =
        fillUpIndividualElements(
            remainingElementsAfterInitSplit,
            initValueElements.size,
        );

        const { userSelectedElements, remainingElements } =
        getUserSelectedElements(remainingElementsAfterFillUp, stickyFilters.userSelectedFilters);

        const individualElementsArray =
            getIndividualElementsArray(
                validElementConfigs,
                initValueElements,
                fillUpElements,
                userSelectedElements,
            );

        const restElementsArray = [...remainingElements.entries()].map(entry => entry[1]);

        return {
            individualElementsArray,
            restElementsArray,
        };
    }, [
        columns,
        stickyFilters,
    ]);

    const handleRestMenuItemSelected = React.useCallback((id: string) => {
        setVisibleSelector(id);
        onRestMenuItemSelected(id);
    }, [
        setVisibleSelector,
        onRestMenuItemSelected,
    ]);

    const filterButtons = React.useMemo(() => {
        const { individualElementsArray, restElementsArray } = elementsContainer;
        const individualFilterButtons = renderIndividualFilterButtons(
            individualElementsArray,
            visibleSelectorId,
            setVisibleSelector,
            listId,
            classes,
        );
        const restButton = renderRestButton(
            restElementsArray,
            listId,
            handleRestMenuItemSelected,
        );

        return [
            [...individualFilterButtons],
            restButton,
        ];
    }, [
        elementsContainer,
        visibleSelectorId,
        setVisibleSelector,
        listId,
        classes,
        handleRestMenuItemSelected,
    ]);

    return (
        <>
            {filterButtons}
        </>
    );
};

export default withStyles(getStyles)(Filters);
