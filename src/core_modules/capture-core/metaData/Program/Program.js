// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import isFunction from 'd2-utilizr/lib/isFunction';
import type { ProgramRule, ProgramRuleVariable } from '@dhis2/rules-engine-javascript';
import type{ CategoryCombination } from '../CategoryCombinations';
import type { Icon } from '../Icon';
import type { Access } from '../Access';
import type { ProgramStage } from './ProgramStage';

export class Program {
    static errorMessages = {
        STAGE_NOT_FOUND: 'Stage was not found',
        STAGE_INDEX_NOT_FOUND: 'No stage found on index',
    }

    _id: string;
    _access: Access;
    _name: string;
    _shortName: string;
    _stages: Map<string, ProgramStage>;
    _organisationUnits: Object;
    _categoryCombination: ?CategoryCombination;
    _programRules: Array<ProgramRule>;
    _programRuleVariables: Array<ProgramRuleVariable>;
    _icon: Icon | void;
    _displayFrontPageList: boolean;
    _useFirstStageDuringRegistration: boolean;
    _onlyEnrollOnce: boolean;

    constructor(initFn: ?(_this: Program) => void) {
        this.programRules = [];
        this.programRuleVariables = [];
        this.organisationUnits = {};
        this._stages = new Map();
        this._organisationUnits = {};
        initFn && isFunction(initFn) && initFn(this);
    }


    // $FlowFixMe[unsupported-syntax] automated comment
    * [Symbol.iterator](): Iterator<ProgramStage> {
        for (const stage of this._stages.values()) {
            yield stage;
        }
    }

    set id(id: string): void {
        this._id = id;
    }
    get id(): string {
        return this._id;
    }

    set access(access: Access): void {
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

    set shortName(shortName: string) {
        this._shortName = shortName;
    }
    get shortName(): string {
        return this._shortName;
    }

    set organisationUnits(organisationUnits: ?Object) {
        this._organisationUnits = organisationUnits || {};
    }
    get organisationUnits(): Object {
        return this._organisationUnits;
    }

    set categoryCombination(categoryCombination: ?CategoryCombination) {
        this._categoryCombination = categoryCombination;
    }
    get categoryCombination(): ?CategoryCombination {
        return this._categoryCombination;
    }

    set programRules(programRules: Array<ProgramRule>) {
        this._programRules = programRules;
    }
    get programRules(): Array<ProgramRule> {
        return this._programRules;
    }

    set programRuleVariables(programRuleVariables: Array<ProgramRuleVariable>) {
        this._programRuleVariables = programRuleVariables;
    }
    get programRuleVariables(): Array<ProgramRuleVariable> {
        return this._programRuleVariables;
    }

    set icon(icon?: Icon) {
        this._icon = icon;
    }
    get icon(): Icon | void {
        return this._icon;
    }

    set displayFrontPageList(displayFrontPageList: boolean) {
        this._displayFrontPageList = displayFrontPageList;
    }

    get displayFrontPageList() {
        return this._displayFrontPageList;
    }

    set useFirstStageDuringRegistration(useFirstStageDuringRegistration: boolean) {
        this._useFirstStageDuringRegistration = useFirstStageDuringRegistration;
    }

    get useFirstStageDuringRegistration() {
        return this._useFirstStageDuringRegistration;
    }

    set onlyEnrollOnce(onlyEnrollOnce: boolean) {
        this._onlyEnrollOnce = onlyEnrollOnce;
    }

    get onlyEnrollOnce() {
        return this._onlyEnrollOnce;
    }

    get stages(): Map<string, ProgramStage> {
        return this._stages;
    }

    addStage(stage: ProgramStage) {
        this.stages.set(stage.id, stage);
    }

    getStage(id: string): ?ProgramStage {
        return this.stages.get(id);
    }

    addProgramRuleVariables(programRuleVariables: Array<ProgramRuleVariable>) {
        this.programRuleVariables = [...this.programRuleVariables, ...programRuleVariables];
    }

    addProgramRules(programRules: Array<ProgramRule>) {
        this.programRules = [...this.programRules, ...programRules];
    }
}
