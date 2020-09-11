// @flow
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import isFunction from 'd2-utilizr/lib/isFunction';
import type { ProgramRule } from '../../rules/engine';
import { validationStrategies, validationStrategiesAsArray } from './renderFoundation.const';
import type Section from './Section';
import type CustomForm from './CustomForm';
import type DataElement, { ConvertFn } from '../DataElement/DataElement';
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
}
