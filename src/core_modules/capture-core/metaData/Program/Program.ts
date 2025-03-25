/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import isFunction from 'd2-utilizr/lib/isFunction';
import type { ProgramRule, ProgramRuleVariable } from '@dhis2/rules-engine-javascript';
import type { CategoryCombination } from '../CategoryCombinations';
import type { Icon } from '../Icon';
import type { Access } from '../Access';
import type { ProgramStage } from './ProgramStage';

export class Program {
    static errorMessages = {
        STAGE_NOT_FOUND: 'Stage was not found',
        STAGE_INDEX_NOT_FOUND: 'No stage found on index',
    };

    private _id: string;
    private _access: Access;
    private _name: string;
    private _shortName: string;
    private _stages: Map<string, ProgramStage>;
    private _organisationUnits: Record<string, unknown>;
    private _categoryCombination: CategoryCombination | null | undefined;
    private _programRules: Array<ProgramRule>;
    private _programRuleVariables: Array<ProgramRuleVariable>;
    private _icon: Icon | undefined;
    private _displayFrontPageList: boolean;
    private _useFirstStageDuringRegistration: boolean;
    private _onlyEnrollOnce: boolean;

    constructor(initFn?: (this: Program) => void) {
        this.programRules = [];
        this.programRuleVariables = [];
        this.organisationUnits = {};
        this._stages = new Map();
        this._organisationUnits = {};
        initFn && isFunction(initFn) && initFn(this);
    }

    *[Symbol.iterator](): Iterator<ProgramStage> {
        for (const stage of this._stages.values()) {
            yield stage;
        }
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

    set shortName(shortName: string) {
        this._shortName = shortName;
    }

    get shortName(): string {
        return this._shortName;
    }

    set organisationUnits(organisationUnits: Record<string, unknown> | null | undefined) {
        this._organisationUnits = organisationUnits || {};
    }

    get organisationUnits(): Record<string, unknown> {
        return this._organisationUnits;
    }

    set categoryCombination(categoryCombination: CategoryCombination | null | undefined) {
        this._categoryCombination = categoryCombination;
    }

    get categoryCombination(): CategoryCombination | null | undefined {
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

    get icon(): Icon | undefined {
        return this._icon;
    }

    set displayFrontPageList(displayFrontPageList: boolean) {
        this._displayFrontPageList = displayFrontPageList;
    }

    get displayFrontPageList(): boolean {
        return this._displayFrontPageList;
    }

    set useFirstStageDuringRegistration(useFirstStageDuringRegistration: boolean) {
        this._useFirstStageDuringRegistration = useFirstStageDuringRegistration;
    }

    get useFirstStageDuringRegistration(): boolean {
        return this._useFirstStageDuringRegistration;
    }

    set onlyEnrollOnce(onlyEnrollOnce: boolean) {
        this._onlyEnrollOnce = onlyEnrollOnce;
    }

    get onlyEnrollOnce(): boolean {
        return this._onlyEnrollOnce;
    }

    get stages(): Map<string, ProgramStage> {
        return this._stages;
    }

    addStage(stage: ProgramStage) {
        this.stages.set(stage.id, stage);
    }

    getStage(id: string): ProgramStage | null | undefined {
        return this.stages.get(id);
    }

    addProgramRuleVariables(programRuleVariables: Array<ProgramRuleVariable>) {
        this.programRuleVariables = [...this.programRuleVariables, ...programRuleVariables];
    }

    addProgramRules(programRules: Array<ProgramRule>) {
        this.programRules = [...this.programRules, ...programRules];
    }
} 