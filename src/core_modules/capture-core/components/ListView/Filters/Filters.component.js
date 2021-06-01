// @flow
import React, { memo } from 'react';
import log from 'loglevel';
import { withStyles } from '@material-ui/core/styles';
import { errorCreator } from 'capture-core-utils';
import { FilterButton } from './FilterButton';
import { FilterRestMenu } from './FilterRestMenu/FilterRestMenu.component';
import { filterTypesObject } from './filters.const';
import type { Column, StickyFilters, FiltersOnly } from '../types';

const getStyles = (theme: Theme) => ({
    filterButtonContainer: {
        paddingRight: theme.typography.pxToRem(theme.spacing.unit),
        paddingBottom: theme.typography.pxToRem(theme.spacing.unit / 2),
        paddingTop: theme.typography.pxToRem(theme.spacing.unit / 2),
    },
});

type Props = {
    columns: ?Array<Column>,
    filtersOnly?: FiltersOnly,
    stickyFilters: StickyFilters,
    onSelectRestMenuItem: Function,
    onUpdateFilter: Function,
    onClearFilter: Function,
    classes: Object,
};

const getValidElementConfigsVisiblePrioritized = (columns: Array<Column>) =>
    new Map(
        columns
            .filter(col => Object.values(filterTypesObject).includes(col.type) && !col.filterDisabled)
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

const renderIndividualFilterButtons = ({
    individualElementsArray,
    filtersOnly,
    visibleSelectorId,
    onSetVisibleSelector,
    onUpdateFilter,
    onClearFilter,
    classes,
}: {
    individualElementsArray: Array<Column>,
    filtersOnly?: FiltersOnly,
    visibleSelectorId: ?string,
    onSetVisibleSelector: Function,
    onUpdateFilter: Function,
    onClearFilter: Function,
    classes: Object,
}) => [...(filtersOnly || []), ...individualElementsArray]
    .map(({ id, type, header, options, multiValueFilter }) => (
        <div
            key={id}
            data-test={`filter-button-container-${id}`}
            className={classes.filterButtonContainer}
        >
            <FilterButton
                data-test={`filter-button-${id}`}
                itemId={id}
                type={type}
                title={header}
                options={options}
                multiValueFilter={multiValueFilter}
                onSetVisibleSelector={onSetVisibleSelector}
                selectorVisible={id === visibleSelectorId}
                onUpdateFilter={onUpdateFilter}
                onClearFilter={onClearFilter}
            />
        </div>
    ),
    );

const renderRestButton = (
    restElementsArray: Array<Column>,
    onSelectRestMenuItem: Function,
) => (restElementsArray.length > 0 ? (
    <FilterRestMenu
        key={'restMenu'}
        data-test="filter-rest-menu"
        columns={restElementsArray}
        onItemSelected={onSelectRestMenuItem}
    />
) : null);


const FiltersPlain = memo<Props>((props: Props) => {
    const {
        columns,
        stickyFilters,
        onSelectRestMenuItem,
        onUpdateFilter,
        onClearFilter,
        filtersOnly,
        classes,
    } = props;

    const [visibleSelectorId, setVisibleSelector] = React.useState(undefined);
    const filtersOnlyCount = filtersOnly ? filtersOnly.length : 0;

    const elementsContainer = React.useMemo(() => {
        const notEmptyColumns = columns || [];
        const validElementConfigs = getValidElementConfigsVisiblePrioritized(notEmptyColumns);

        const { initValueElements, remainingElements: remainingElementsAfterInitSplit } =
            splitBasedOnHasValueOnInit(validElementConfigs, stickyFilters.filtersWithValueOnInit);

        const { fillUpElements, remainingElements: remainingElementsAfterFillUp } =
        fillUpIndividualElements(
            remainingElementsAfterInitSplit,
            initValueElements.size + filtersOnlyCount,
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
        filtersOnlyCount,
    ]);

    const handleRestMenuItemSelected = React.useCallback((id: string) => {
        setVisibleSelector(id);
        onSelectRestMenuItem(id);
    }, [
        setVisibleSelector,
        onSelectRestMenuItem,
    ]);

    const filterButtons = React.useMemo(() => {
        const { individualElementsArray, restElementsArray } = elementsContainer;
        const individualFilterButtons = renderIndividualFilterButtons({
            individualElementsArray,
            visibleSelectorId,
            onSetVisibleSelector: setVisibleSelector,
            onUpdateFilter,
            onClearFilter,
            filtersOnly,
            classes,
        });
        const restButton = renderRestButton(
            restElementsArray,
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
        classes,
        handleRestMenuItemSelected,
        onUpdateFilter,
        onClearFilter,
        filtersOnly,
    ]);

    return (
        <React.Fragment>
            {filterButtons}
        </React.Fragment>
    );
});

export const Filters = withStyles(getStyles)(FiltersPlain);
