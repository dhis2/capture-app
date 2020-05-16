// @flow
import { chunk } from 'capture-core-utils';
import { getContext } from '../context';
import { queryOptionSets, queryOptionGroups } from './queries';

type InputOutline = {
    id: string,
    version: string,
};

type ApiOptionGroup = {
    id: string,
    displayName: string,
    options: Array<{id: string}>,
    optionSet: { id: string },
}

type ApiOption = {
    id: string,
    displayName: string,
    code: string,
    style: string,
    translations: any,
}

type ApiOptionSet = {
    id: string,
    displayName: string,
    version: string,
    valueType: string,
    translations: any,
    options: Array<ApiOption>,
}

type OptionGroupsByOptionSet = {
    [optionSetId: string]: Array<ApiOptionGroup>
};

function getOptionGroups(optionSetIds: Array<string>) {
    const pageSize = 10000;

    const request = async (page: number = 1) => {
        const { optionGroups, hasNextPage } = await queryOptionGroups(optionSetIds, page, pageSize);
        if (hasNextPage) {
            const optionGroupsFromPageHierarchy = await request(page += 1);
            return [...optionGroups, ...optionGroupsFromPageHierarchy];
        }

        return optionGroups || [];
    };

    return request();
}

async function getIdsToLoad(
    optionSetsOutline: Array<InputOutline>,
) {
    const idsToLoad = [];
    const { storageController, storeNames } = getContext();
    await optionSetsOutline.asyncForEach(async (outline) => {
        const storeOptionSet = await storageController
            .get(storeNames.OPTION_SETS, outline.id);

        if (!storeOptionSet || storeOptionSet.version !== outline.version) {
            idsToLoad.push(outline.id);
        }
    });
    return idsToLoad;
}

const getGroupsByOptionSet = (
    groupsByOptionSet: {[optionSetId: string]: Array<ApiOptionGroup>},
    optionGroups: Array<ApiOptionGroup>) => optionGroups.reduce((accGroupsByOptionSet, optionGroup) => {
    accGroupsByOptionSet[optionGroup.optionSet.id] = [
        ...(accGroupsByOptionSet[optionGroup.optionSet.id] || []),
        optionGroup,
    ];
    return accGroupsByOptionSet;
}, groupsByOptionSet);

const getGroupsBatchesByOptionSet = (optionGroupsBatches: Array<Array<ApiOptionGroup>>) =>
    optionGroupsBatches
        .reduce((accGroupsByOptionSets, batch) => getGroupsByOptionSet(accGroupsByOptionSets, batch), {});

const getOptionSets = (optionSetsBatches: Array<Array<ApiOptionSet>>) =>
    optionSetsBatches.reduce((accOptionSets, batch) => [...accOptionSets, ...batch], []);

const getCacheOptionSets = (optionSets: Array<ApiOptionSet>, optionGroupsByOptionSet: OptionGroupsByOptionSet) =>
    optionSets.map(optionSet => ({
        id: optionSet.id,
        displayName: optionSet.displayName,
        version: optionSet.version,
        valueType: optionSet.valueType,
        translations: optionSet.translations,
        options: optionSet.options && [...optionSet.options.values()].map(option => ({
            id: option.id,
            displayName: option.displayName,
            code: option.code,
            style: option.style,
            translations: option.translations,
        })),
        optionGroups: optionGroupsByOptionSet[optionSet.id] && optionGroupsByOptionSet[optionSet.id].map(optionGroup => ({
            id: optionGroup.id,
            displayName: optionGroup.displayName,
            options: optionGroup.options && [...optionGroup.options.values()].map(option => option.id),
        })),
    }));

export async function loadOptionSets(
    optionSetsOutline: Array<InputOutline>,
) {
    const filteredOptionSetsOutline = optionSetsOutline.reduce((accFilteredOptionSetsOutline, optionSetMeta) => {
        if (!accFilteredOptionSetsOutline.find(om => om.id === optionSetMeta.id)) {
            accFilteredOptionSetsOutline.push(optionSetMeta);
        }
        return accFilteredOptionSetsOutline;
    }, []);
    const optionSetsIds = await getIdsToLoad(filteredOptionSetsOutline);
    const batchedOptionSetIds = chunk(optionSetsIds, 50);

    const optionSetsBatches = await Promise.all(
        batchedOptionSetIds
            .map(batch => queryOptionSets(batch)),
    );

    const optionGroupsBatches = await Promise.all(
        batchedOptionSetIds
            .map(batch => getOptionGroups(batch)),
    );

    const optionSets = getOptionSets(optionSetsBatches);

    const optionGroupsByOptionSet = getGroupsBatchesByOptionSet(optionGroupsBatches);

    const optionSetsToStore = getCacheOptionSets(optionSets, optionGroupsByOptionSet);

    const { storageController, storeNames } = getContext();
    await storageController.setAll(storeNames.OPTION_SETS, optionSetsToStore);
}
