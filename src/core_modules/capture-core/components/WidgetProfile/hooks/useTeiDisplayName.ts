import { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { convertClientToView } from '../DataEntry';

const DEFAULT_NAME = i18n.t('tracked entity instance');

type TeiAttribute = {
    attribute: string;
    value?: string;
    [key: string]: any;
};

type TetAttribute = {
    displayInList?: boolean;
    trackedEntityAttribute: {
        id: string;
        [key: string]: any;
    };
    [key: string]: any;
};

const convertValue = (attribute: TeiAttribute | undefined) => {
    if (attribute?.value) {
        const convertedValue = convertClientToView(attribute as any);
        return typeof convertedValue === 'string' ? convertedValue : '';
    }
    return '';
};

const getAttributesValues = (attributes: TeiAttribute[], firstId: string, secondId?: string): string => {
    const firstValue = convertValue(attributes.find(({ attribute }) => attribute === firstId));
    const secondValue = convertValue(attributes.find(({ attribute }) => attribute === secondId));

    return firstValue ?? secondValue 
        ? `${firstValue}${firstValue && ' '}${secondValue}` 
        : '';
};

const getTetAttributesDisplayInList = (attributes: TeiAttribute[], tetAttributes: TetAttribute[]) => {
    const [firstId, secondId] = tetAttributes
        .filter(({ displayInList }) => displayInList)
        .map(({ trackedEntityAttribute }) => trackedEntityAttribute.id);
    return getAttributesValues(attributes, firstId, secondId);
};

const getTetAttributes = (attributes: TeiAttribute[], tetAttributes: { id: string }[]) => {
    const [firstId, secondId] = tetAttributes.map(({ id }) => id);
    return getAttributesValues(attributes, firstId, secondId);
};

const deriveTeiName = (
    tetAttributes: TetAttribute[] | { id: string }[], 
    updatedAttributes: TeiAttribute[], 
    fallbackName?: string
) => {
    if (!tetAttributes || !updatedAttributes) return fallbackName ?? DEFAULT_NAME;

    const teiNameDisplayInReports = getTetAttributesDisplayInList(updatedAttributes, tetAttributes as TetAttribute[]);
    if (teiNameDisplayInReports) return teiNameDisplayInReports;

    const teiName = getTetAttributes(updatedAttributes, tetAttributes as { id: string }[]);
    if (teiName) return teiName;

    return fallbackName ?? DEFAULT_NAME;
};

export const useTeiDisplayName = (
    program: any,
    storedAttributeValues: Array<{ [attrId: string]: any }>,
    attributes: Array<TeiAttribute>,
    fallbackName?: string,
) =>
    useMemo(() => {
        const tetAttributes = program?.trackedEntityType?.trackedEntityTypeAttributes;
        const updatedAttributes = attributes.map(attribute => ({
            ...attribute,
            value: storedAttributeValues.find(
                storedAttributeValue => storedAttributeValue.attribute === attribute.attribute,
            )?.value,
        }));

        return deriveTeiName(tetAttributes, updatedAttributes, fallbackName);
    }, [program, storedAttributeValues, attributes, fallbackName]);
