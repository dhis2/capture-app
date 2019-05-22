// @flow
import StorageController from 'capture-core-utils/storage/StorageController';

import chunk from '../../utils/chunk';
import { getterTypes, ApiSpecification } from '../../api';

const batchSize = 50;

type InputMeta = {
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


async function request(specification: ApiSpecification, pageNr: number, pageSize: number) {
    specification.updateQueryParams({ page: pageNr, pageSize });

    const resultsContainer = await specification.get();
    const results = resultsContainer && [...resultsContainer.values()];

    if (results && results.length === pageSize) {
        const resultsFromPageHierarchy = await request(specification, pageNr += 1, pageSize);
        return [...results, ...resultsFromPageHierarchy];
    }

    return results || [];
}

async function getOptionSetsAsync(
    ids: Array<string>,
): Promise<Array<ApiOptionSet>> {
    const optionSetsApiSpec = new ApiSpecification((_this) => {
        _this.modelName = 'optionSets';
        _this.modelGetterType = getterTypes.LIST_WITH_PAGER;
        _this.queryParams = {
            fields: 'id,displayName,version,valueType,options[id,displayName,code,style, translations]',
            paging: true,
            totalPages: false,
        };
    });
    optionSetsApiSpec.setFilter(`id:in:[${ids.toString()}]`);
    const optionSets = await request(optionSetsApiSpec, 1, 10000);
    return optionSets;
}

async function getOptionGroupsAsync(
    optionSetIds: Array<string>,
): Promise<Array<ApiOptionGroup>> {
    const optionGroupsApiSpec = new ApiSpecification((_this) => {
        _this.modelName = 'optionGroups';
        _this.modelGetterType = getterTypes.LIST_WITH_PAGER;
        _this.queryParams = {
            fields: 'id,displayName,options[id],optionSet[id]',
            paging: true,
            totalPages: false,
        };
    });
    optionGroupsApiSpec.setFilter(`optionSet.id:in:[${optionSetIds.toString()}]`);
    const optionGroups = await request(optionGroupsApiSpec, 1, 10000);
    return optionGroups;
}

async function getIdsToLoad(
    optionSetsMeta: Array<InputMeta>,
    storeName: string,
    storageController: StorageController,
) {
    const idsToLoad = [];
    await optionSetsMeta.asyncForEach(async (meta) => {
        const storeOptionSet = await storageController
            .get(storeName, meta.id);

        if (!storeOptionSet || storeOptionSet.version !== meta.version) {
            idsToLoad.push(meta.id);
        }
    });
    return idsToLoad;
}

const getGroupsByOptionSet = (groupsByOptionSet: {[optionSetId: string]: Array<ApiOptionGroup>}, optionGroups: Array<ApiOptionGroup>) => optionGroups.reduce((accGroupsByOptionSet, optionGroup) => {
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

export default async function loadOptionSets(
    storageController: StorageController,
    store: string,
    optionSetsMeta: Array<InputMeta>,
) {
    const filteredOptionSetsMeta = optionSetsMeta.reduce((accFilteredOptionSetsMeta, optionSetMeta) => {
        if (!accFilteredOptionSetsMeta.find(om => om.id === optionSetMeta.id)) {
            accFilteredOptionSetsMeta.push(optionSetMeta);
        }
        return accFilteredOptionSetsMeta;
    }, []);
    const optionSetsIds = await getIdsToLoad(filteredOptionSetsMeta, store, storageController);
    const batchedOptionSetIds = chunk(optionSetsIds, batchSize);

    const optionSetsBatches = await Promise.all(
        batchedOptionSetIds
            .map(batch => getOptionSetsAsync(batch)),
    );

    const optionGroupsBatches = await Promise.all(
        batchedOptionSetIds
            .map(batch => getOptionGroupsAsync(batch)),
    );
    const optionSets = getOptionSets(optionSetsBatches);

    const optionGroupsByOptionSet = getGroupsBatchesByOptionSet(optionGroupsBatches);

    const optionSetsToStore = getCacheOptionSets(optionSets, optionGroupsByOptionSet);

    await storageController.setAll(store, optionSetsToStore);
}
