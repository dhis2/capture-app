// @flow
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import isFunction from 'd2-utilizr/lib/isFunction';
import { validationStrategies, validationStrategiesAsArray } from './renderFoundation.const';
import { Section } from './Section';
import type { ConvertFn } from '../DataElement/DataElement';
import type { Access } from '../Access';
import { convertDataElementsValues } from '../helpers';
import type { ValuesType } from '../helpers/DataElements/convertValues';
import { DataElement } from '../DataElement';
import { FormFieldPluginConfig } from '../FormFieldPluginConfig';

export class RenderFoundation {
    static errorMessages = {
        UNSUPPORTED_VALIDATION_STRATEGY: 'Tried to set an unsupported validation strategy',
    };

    _id: string;
    _access: Access;
    _name: string;
    _description: ?string;
    _programId: string;
    _sections: Map<string, Section>;
    _labels: { [key: string]: string };
    _featureType: string;
    _validationStrategy: $Values<typeof validationStrategies>;

    constructor(initFn: ?(_this: RenderFoundation) => void) {
        this._sections = new Map();
        this._labels = {};
        this._validationStrategy = validationStrategies.ON_UPDATE_AND_INSERT;
        initFn && isFunction(initFn) && initFn(this);
    }

    set id(id: string) {
        this._id = id;
    }
    get id(): string {
        return this._id;
    }

    set access(access: Access) {
        this._access = access;
    }
    get access(): Access {
        return this._access;
    }

    set name(name: string) {
        this._name = name;
    }
    get name(): string {
        return this._name;
    }

    set description(description: ?string) {
        this._description = description;
    }
    get description(): ?string {
        return this._description;
    }

    set programId(programId: string) {
        this._programId = programId;
    }
    get programId(): string | number {
        return this._programId;
    }

    get sections(): Map<string, Section> {
        return this._sections;
    }

    set featureType(featureType: string) {
        this._featureType = featureType;
    }
    get featureType(): string {
        return this._featureType;
    }

    set validationStrategy(strategy: string) {
        if (!strategy) {
            return;
        }

        if (!validationStrategiesAsArray.includes(strategy)) {
            log.warn(errorCreator(
                RenderFoundation.errorMessages.UNSUPPORTED_VALIDATION_STRATEGY)({ renderFoundation: this, strategy }),
            );
            return;
        }

        this._validationStrategy = strategy;
    }
    get validationStrategy(): $Values<typeof validationStrategies> {
        return this._validationStrategy;
    }

    addLabel({ id, label }: { id: string, label: string }) {
        this._labels[id] = label;
    }

    getLabel(id: string) {
        return this._labels[id];
    }

    getLabels() {
        return this._labels;
    }

    addSection(newSection: Section) {
        this._sections.set(newSection.id, newSection);
    }

    getSection(id: string) {
        return this._sections.get(id);
    }

    getElement(id: string) {
        const elements = this.getElementsById();
        return elements[id];
    }

    getElements(): Array<DataElement> {
        return Array.from(this.sections.entries()).map(entry => entry[1])
            .reduce((accElements, section) => {
                const elementsInSection = Array.from(section.elements.entries())
                    .reduce((acc, entry) => {
                        const dataEntryElement = entry[1];
                        if (dataEntryElement instanceof FormFieldPluginConfig) {
                            acc.push(...Array.from(dataEntryElement.fields.entries())
                                .map(fieldEntry => fieldEntry[1]));
                        } else if (dataEntryElement instanceof DataElement) {
                            acc.push(dataEntryElement);
                        }
                        return acc;
                    }, []);
                return [...accElements, ...elementsInSection];
            }, []);
    }

    getElementsById(): {[id: string]: DataElement} {
        return Array.from(this.sections.entries()).map(entry => entry[1])
            .reduce((accElements, section) => {
                const elementsInSection =
                    Array.from(section.elements.entries()).reduce((accElementsInSection, elementEntry) => {
                        const dataEntryElement = elementEntry[1];
                        if (dataEntryElement instanceof FormFieldPluginConfig) {
                            accElementsInSection[dataEntryElement.id] = Array.from(dataEntryElement.fields.entries())
                                .reduce((accFields, fieldEntry) => {
                                    const field = fieldEntry[1];
                                    accFields[field.id] = field;
                                    return accFields;
                                }, {});
                        } else if (dataEntryElement instanceof DataElement) {
                            accElementsInSection[elementEntry[0]] = dataEntryElement;
                        }
                        return accElementsInSection;
                    }, {});
                return { ...accElements, ...elementsInSection };
            }, {});
    }

    convertValues<T: ?ValuesType | Array<ValuesType>>(values: T, onConvert: ConvertFn): T {
        const dataElements = this.getElements();
        return convertDataElementsValues(values, dataElements, onConvert);
    }

    convertAndGroupBySection(currentFormData: {[id: string]: any}, onConvert: ConvertFn) {
        const metaElements = [...this.getElements().values()];

        return Object.keys(currentFormData).reduce((acc, id) => {
            const metaElement = metaElements.find(o => o.id === id);
            const rawValue = currentFormData[id];
            const convertedValue = metaElement ? metaElement.convertValue(rawValue, onConvert) : rawValue;
            const group = metaElement?.section?.group;
            if (group) {
                acc[group] = { ...acc[group], [id]: convertedValue };
                return acc;
            }
            return { ...acc, [id]: convertedValue };
        }, {});
    }
}
