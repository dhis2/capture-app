// @flow
import { quickStore } from '../../IOUtils';
import { getContext } from '../../context';

const convertTranslationsToObject = translations =>
    (translations || [])
        .reduce((accTranslationObject, translation) => {
            if (!accTranslationObject[translation.locale]) {
                accTranslationObject[translation.locale] = {};
            }
            accTranslationObject[translation.locale][translation.property] = translation.value;
            return accTranslationObject;
        }, {});

const convert = response => response?.dataElements?.map((dataElement) => {
    dataElement.translations = convertTranslationsToObject(dataElement.translations);
    return dataElement;
});

export const storeDataElements = (ids: Array<string>) => {
    const query = {
        resource: 'dataElements',
        params: {
            fields: 'id,displayName,code,displayShortName,displayFormName,valueType,' +
                'translations[*],description,url,optionSetValue,style,optionSet[id]',
            filter: `id:in:[${ids.join(',')}]`,
            pageSize: ids.length,
        },
    };

    return quickStore({
        query,
        storeName: getContext().storeNames.DATA_ELEMENTS,
        convertQueryResponse: convert,
    });
};
