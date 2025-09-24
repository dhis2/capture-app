import React, { memo, useMemo } from 'react';
import log from 'loglevel';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

import { errorCreator } from 'capture-core-utils';
import { FilterButton } from './FilterButton';
import { FilterRestMenu } from './FilterRestMenu/FilterRestMenu.component';
import { filterTypesObject } from './filters.const';
import type { Column, StickyFilters, FiltersOnly, AdditionalFilters, FilterOnly, UpdateFilter, ClearFilter, RemoveFilter } from '../types';

const getStyles = (theme: any) => ({
    filterButtonContainer: {
        paddingRight: theme.typography.pxToRem(theme.spacing.unit),
        paddingBottom: theme.typography.pxToRem(theme.spacing.unit / 2),
        paddingTop: theme.typography.pxToRem(theme.spacing.unit / 2),
    },
});

type Props = {
    columns: Array<Column> | null;
    filtersOnly?: FiltersOnly;
    additionalFilters?: AdditionalFilters;
    visibleSelectorId?: string | null;
    stickyFilters: StickyFilters;
    onSelectRestMenuItem: (id: string) => void;
    onUpdateFilter: UpdateFilter;
    onClearFilter: ClearFilter;
    onRemoveFilter: RemoveFilter;
};

const getValidElementConfigsVisiblePrioritized = (columns: Array<Column>) =>
    new Map(
        columns
            .filter(col => Object.values(filterTypesObject).includes(col.type as any) && !col.filterHidden)
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

const getValidFilterConfigs = (filtersOnly: FiltersOnly) => new Map(filtersOnly.map(filter => [filter.id, filter]));

const splitBasedOnHasValueOnInit =
    (elementConfigs: Map<string, Column | FilterOnly>, filtersWithValueOnInit: any | null) => {
        const filtersNotEmpty = filtersWithValueOnInit || {};
        return Object
            .keys(filtersNotEmpty)
            .reduce((acc, key) => {
                const config = elementConfigs.get(key);

                if (!config) {
                    log.warn(
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
    elementConfigs: Map<string, Column | FilterOnly>,
    occupiedSpots: number,
) => {
    const INDIVIDUAL_DISPLAY_COUNT_BASE = 4;

    const fillUpElements = new Map();
    const availableSpots = INDIVIDUAL_DISPLAY_COUNT_BASE - occupiedSpots;

    for (let index = 0; elementConfigs.size > 0 && index < availableSpots; index++) {
        const entry = elementConfigs.entries().next().value;
        if (!entry) break;
        const [key, value] = entry;
        fillUpElements.set(key, value);
        elementConfigs.delete(key);
    }

    return {
        fillUpElements,
        remainingElements: elementConfigs,
    };
};

const getUserSelectedElements = (
    elementConfigs: Map<string, Column | FilterOnly>,
    userSelectedFilters: any | null,
) => {
    const userSelectedFiltersNonEmpty = userSelectedFilters || {};

    return Object
        .keys(userSelectedFiltersNonEmpty)
        .reduce((acc, key) => {
            const config = elementConfigs.get(key);
            if (!config) {
                log.warn(
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

const addAdditionalFiltersElements = (
    elementConfigs: Map<string, Column | FilterOnly>,
    additionalFilters?: AdditionalFilters,
    filtersWithValueOnInit: any = {},
    userSelectedFilters: any = {},
) => {
    const mainButtonAdditionalFilters = additionalFilters && additionalFilters.find(filter => filter.mainButton);
    if (mainButtonAdditionalFilters) {
        const addToRemainingElements =
        !filtersWithValueOnInit[mainButtonAdditionalFilters.id] && !userSelectedFilters[mainButtonAdditionalFilters.id];

        if (addToRemainingElements) {
            const remainingElements =
                new Map([...elementConfigs, [mainButtonAdditionalFilters.id, mainButtonAdditionalFilters]]);
            return { remainingElements };
        }
        return { remainingElements: elementConfigs };
    }
    return { remainingElements: elementConfigs };
};

const addShowInMoreFilters = (
    elementConfigs: Map<string, Column | FilterOnly>,
    filtersOnlyForShowInMoreFilters: FiltersOnly,
    filtersWithValueOnInit: any = {},
    userSelectedFilters: any = {},
) => {
    const remainingElements: Map<string, Column | FilterOnly> =
        new Map([...elementConfigs]);
    if (filtersOnlyForShowInMoreFilters.length > 0) {
        filtersOnlyForShowInMoreFilters.forEach((filter) => {
            const addToRemainingElements =
                !filtersWithValueOnInit[filter.id] && !userSelectedFilters[filter.id];

            if (addToRemainingElements) {
                remainingElements.set(filter.id, filter);
            }
        });
        return { remainingElements };
    }
    return { remainingElements: elementConfigs };
};

const getIndividualElementsArray = (
    validElementConfigs: Map<string, Column | FilterOnly>,
    initValueElements: Map<string, Column | FilterOnly>,
    fillUpElements: Map<string, Column | FilterOnly>,
    userSelectedElements: Map<string, Column | FilterOnly>,
): Array<Column | FilterOnly> => [...validElementConfigs.entries()]
    .map(entry => entry[1])
    .map((element) => {
        if (initValueElements.has(element.id) ||
            fillUpElements.has(element.id) ||
            userSelectedElements.has(element.id)) {
            return element;
        }
        return undefined;
    })
    .filter(element => element !== undefined);

const renderIndividualFilterButtons = ({
    individualElementsArray,
    filtersOnly,
    visibleSelectorId,
    onSetVisibleSelector,
    onUpdateFilter,
    onClearFilter,
    onRemoveFilter,
    classes,
}: {
    individualElementsArray: Array<Column | FilterOnly>;
    filtersOnly?: FiltersOnly;
    visibleSelectorId?: string | null;
    onSetVisibleSelector: (itemId?: string | null) => void;
    onUpdateFilter: UpdateFilter;
    onClearFilter: ClearFilter;
    onRemoveFilter: RemoveFilter;
    classes: any;
}) => [...(filtersOnly || []), ...individualElementsArray]
    .map(({ id, type, header, options, multiValueFilter, disabled, tooltipContent, mainButton }: any) => (
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
                disabled={disabled}
                tooltipContent={tooltipContent}
                multiValueFilter={multiValueFilter}
                onSetVisibleSelector={onSetVisibleSelector}
                selectorVisible={id === visibleSelectorId}
                onUpdateFilter={onUpdateFilter}
                onClearFilter={onClearFilter}
                isRemovable={mainButton}
                onRemoveFilter={onRemoveFilter}
            />
        </div>
    ),
    );

const renderRestButton = (
    restElementsArray: Array<Column | FilterOnly>,
    onSelectRestMenuItem: (id: string) => void,
) => (restElementsArray.length > 0 ? (
    <FilterRestMenu
        key={'restMenu'}
        data-test="filter-rest-menu"
        columns={restElementsArray}
        onItemSelected={onSelectRestMenuItem}
    />
) : null);


const FiltersPlain = memo<Props & WithStyles<typeof getStyles>>((props: Props & WithStyles<typeof getStyles>) => {
    const {
        columns,
        stickyFilters,
        onSelectRestMenuItem,
        onUpdateFilter,
        onClearFilter,
        onRemoveFilter,
        filtersOnly,
        additionalFilters,
        classes,
    } = props;

    const [visibleSelectorId, setVisibleSelector] = React.useState<string | null | undefined>(props.visibleSelectorId ?? null);
    const defaultFiltersOnly = useMemo(() =>
        (filtersOnly || []).filter(filter => !filter.showInMoreFilters), [filtersOnly]);
    const defaultFiltersOnlyCount = defaultFiltersOnly.length;


    const elementsContainer = React.useMemo(() => {
        const notEmptyColumns = columns || [];
        const filtersOnlyForShowInMoreFilters: FiltersOnly = (filtersOnly || [])
            .filter(filter => filter.showInMoreFilters);

        const validColumnElementConfigs = getValidElementConfigsVisiblePrioritized(notEmptyColumns);
        const validFilterConfigs = getValidFilterConfigs(filtersOnlyForShowInMoreFilters);

        const validElementConfigs: Map<string, Column | FilterOnly> = new Map([
            ...validColumnElementConfigs as any,
            ...validFilterConfigs,
        ]);

        const { filtersWithValueOnInit, userSelectedFilters } = stickyFilters;

        const { initValueElements, remainingElements: remainingElementsAfterInitSplit } =
            splitBasedOnHasValueOnInit(validElementConfigs, filtersWithValueOnInit);

        const { fillUpElements, remainingElements: remainingElementsAfterFillUp } =
        fillUpIndividualElements(
            remainingElementsAfterInitSplit,
            initValueElements.size + defaultFiltersOnlyCount,
        );

        const { remainingElements: remainingElementsWithShowInMoreFilters } = addShowInMoreFilters(
            remainingElementsAfterFillUp,
            filtersOnlyForShowInMoreFilters,
            filtersWithValueOnInit,
            userSelectedFilters,
        );

        const { remainingElements: remainingElementsWithAdditionalFilters } =
            addAdditionalFiltersElements(
                remainingElementsWithShowInMoreFilters, additionalFilters, filtersWithValueOnInit, userSelectedFilters);

        const { userSelectedElements, remainingElements } =
        getUserSelectedElements(remainingElementsWithAdditionalFilters, userSelectedFilters);

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
        filtersOnly,
        defaultFiltersOnlyCount,
        additionalFilters,
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
            onRemoveFilter,
            filtersOnly: defaultFiltersOnly,
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
        onRemoveFilter,
        defaultFiltersOnly,
    ]);

    return (
        <React.Fragment>
            {filterButtons}
        </React.Fragment>
    );
});

export const Filters = withStyles(getStyles)(FiltersPlain);
