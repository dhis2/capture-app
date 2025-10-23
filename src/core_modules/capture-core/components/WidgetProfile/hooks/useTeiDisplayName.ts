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

const getAttributesValues = (attributes: TeiAttribute[], first: TetAttribute, second: TetAttribute): string => {
    const firstValue = convertValue(attributes.find(({ attribute }) => attribute === first?.trackedEntityAttribute?.id));
    const secondValue = convertValue(attributes.find(({ attribute }) => attribute === second?.trackedEntityAttribute?.id));

    return firstValue ?? secondValue ? `${firstValue}${firstValue && ' '}${secondValue}` : '';
};

const getTetAttributesDisplayInList = (attributes: TeiAttribute[], tetAttributes: TetAttribute[]) => {
    const [first, second] = tetAttributes.filter(({ displayInList }) => displayInList);
    return getAttributesValues(attributes, first, second);
};

const getTetAttributes = (attributes: TeiAttribute[], tetAttributes: TetAttribute[]) => {
    const [first, second] = tetAttributes;
    return getAttributesValues(attributes, first, second);
};

const deriveTeiName = (
    attributes: TeiAttribute[],
    tetAttributes: TetAttribute[],
    teiId?: string,
) => {
    if (!attributes || !tetAttributes) return teiId ?? DEFAULT_NAME;

    const teiNameDisplayInList = getTetAttributesDisplayInList(attributes, tetAttributes as TetAttribute[]);
    if (teiNameDisplayInList) return teiNameDisplayInList;

    const teiName = getTetAttributes(attributes, tetAttributes);
    if (teiName) return teiName;

    return teiId ?? DEFAULT_NAME;
};

export const useTeiDisplayName = (
    program: any,
    storedAttributeValues: Array<{ [attrId: string]: any }>,
    attributes: Array<TeiAttribute>,
    teiId?: string,
) =>
    useMemo(() => {
        const tetAttributes = program?.trackedEntityType?.trackedEntityTypeAttributes;
        const updatedAttributes = attributes.map(attribute => ({
            ...attribute,
            value: storedAttributeValues.find(
                storedAttributeValue => storedAttributeValue.attribute === attribute.attribute,
            )?.value,
        }));

        return deriveTeiName(updatedAttributes, tetAttributes, teiId);
    }, [program, storedAttributeValues, attributes, teiId]);
