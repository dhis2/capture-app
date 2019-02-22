// @flow
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';

import isFunction from 'd2-utilizr/src/isFunction';

import { validationStrategies, validationStrategiesAsArray } from './renderFoundation.const';
import Section from './Section';
import CustomForm from './CustomForm';
import DataElement from '../DataElement/DataElement';
import errorCreator from '../../utils/errorCreator';
import type { ConvertFn } from '../DataElement/DataElement';
import type { ProgramRule } from '../../RulesEngine/rulesEngine.types';
import type { Access } from '../Access/Access';
import { convertDataElementsValues } from '../helpers';
import type { ValuesType } from '../helpers/DataElements/convertValues';

export default class RenderFoundation {
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
    _programRules: Array<ProgramRule>;
    _customForm: ?CustomForm;
    _featureType: string;
    _validationStrategy: $Values<typeof validationStrategies>;

    constructor(initFn: ?(_this: RenderFoundation) => void) {
        this._sections = new Map();
        this._labels = {};
        this.programRules = [];
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

    set programRules(programRules: Array<ProgramRule>) {
        this._programRules = programRules;
    }
    get programRules(): Array<ProgramRule> {
        return this._programRules;
    }

    get sections(): Map<string, Section> {
        return this._sections;
    }

    set customForm(customForm: CustomForm) {
        this._customForm = customForm;
    }
    get customForm() {
        return this._customForm;
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

    addProgramRule(programRule: ProgramRule) {
        this.programRules.push(programRule);
    }

    addProgramRules(programRules: Array<ProgramRule>) {
        this.programRules = [...this.programRules, ...programRules];
    }

    getElements(): Array<DataElement> {
        return Array.from(this.sections.entries()).map(entry => entry[1])
            .reduce((accElements, section) => {
                const elementsInSection = Array.from(section.elements.entries()).map(entry => entry[1]);
                return [...accElements, ...elementsInSection];
            }, []);
    }

    getElementsById(): {[id: string]: DataElement} {
        return Array.from(this.sections.entries()).map(entry => entry[1])
            .reduce((accElements, section) => {
                const elementsInSection =
                    Array.from(section.elements.entries()).reduce((accElementsInSection, elementEntry) => {
                        accElementsInSection[elementEntry[0]] = elementEntry[1];
                        return accElementsInSection;
                    }, {});
                return { ...accElements, ...elementsInSection };
            }, {});
    }

    convertValues<T: ?ValuesType | Array<ValuesType>>(values: T, onConvert: ConvertFn): T {
        const dataElements = this.getElements();
        return convertDataElementsValues(values, dataElements, onConvert);
    }

    /*
    convertDynamicOptionSets(dynamicOptionSets: ?dynamicOptionSetsType,
        typeConverters: {[type: $Keys<typeof elementTypeConstants>]: (rawValue: any, metaDataElement: element) => any},
        keyForValueToConvertInOption: string,
        useCodeNameKey: boolean = false) {
        if (dynamicOptionSets) {
            return Object.keys(dynamicOptionSets).reduce((accOptionSets, key) => {
                const metaElement = useCodeNameKey ? this.getElementByCodeName(key) : this.getElement(key);
                const optionSet = dynamicOptionSets[key];
                const type = metaElement && metaElement.details && metaElement.details.type;

                if (optionSet && type && typeConverters[type]) {
                    const convertedOptionSet = optionSet.map((option: Object) => {
                        const value = option[keyForValueToConvertInOption];
                        return Object.assign({}, option, { [keyForValueToConvertInOption]: ((value || value === false || value === 0) ? typeConverters[type](option[keyForValueToConvertInOption], metaElement) : value) });
                    });
                    return Object.assign(accOptionSets, { [key]: convertedOptionSet });
                }

                return Object.assign(accOptionSets, { [key]: optionSet });
            }, {});
        }
        return dynamicOptionSets;
    }

    convertDynamicOptionSetsWithOptionSetObject(dynamicOptionSets: ?OptionSet,
        typeConverters: {[type: $Keys<typeof elementTypeConstants>]: (rawValue: any, metaDataElement: element) => any},
        useCodeNameKey: boolean = true) {
        const keyForValueToConvertInOption = 'value';

        if (dynamicOptionSets) {
            return Object.keys(dynamicOptionSets).reduce((accOptionSets, key) => {
                const metaElement = useCodeNameKey ? this.getElementByCodeName(key) : this.getElement(key);
                const optionSet = dynamicOptionSets[key];
                const type = metaElement && metaElement.details && metaElement.details.type;

                if (optionSet && optionSet._options && type && typeConverters[type]) {
                    const convertedOptions = optionSet._options.map((option: Option) => {
                        const value = option[keyForValueToConvertInOption];
                        return Object.assign({}, option, { [keyForValueToConvertInOption]: ((value || value === false || value === 0) ? typeConverters[type](option[keyForValueToConvertInOption], metaElement) : value) });
                    });

                    const newOptionSet = new OptionSet(convertedOptions);
                    newOptionSet._emptyText = optionSet._emptyText;
                    return Object.assign(accOptionSets, { [key]: newOptionSet });
                }

                return Object.assign(accOptionSets, { [key]: optionSet });
            }, {});
        }
        return dynamicOptionSets;
    }

    getConvertedOptionSets(typeConverters: {[type: $Keys<typeof elementTypeConstants>]: (rawValue: any, metaDataElement: element) => any}, getCodeNameKey: boolean = false): ?{[key: string]: OptionSet} {
        const convertedOptionSets = {};
        this.elements.forEach((element: element) => {
            if (element.details && element.details.optionSet) {
                const orgOptionSet = element.details.optionSet;
                const type = element.details && element.details.type;
                const converter = typeConverters[type];
                const convertedOptions = orgOptionSet._options.map((option: Option) => new Option((_this) => {
                    _this.text = option.text;
                    _this.value = (((option.value || option.value === false || option.value === 0) && converter) ? converter(option.value, element) : option.value);
                }));
                convertedOptionSets[getCodeNameKey ? element.codeName : element.id] = new OptionSet(convertedOptions);
            }
        });
        return (Object.keys(convertedOptionSets).length > 0 ? convertedOptionSets : null);
    }

    */
}
