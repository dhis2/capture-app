// @flow
/* eslint-disable no-underscore-dangle */
import isFunction from 'd2-utilizr/src/isFunction';
import type { ProgramRule, ProgramRuleVariable } from 'capture-core-utils/RulesEngine/rulesEngine.types';
import CategoryCombination from '../CategoryCombinations/CategoryCombination';
import Icon from '../Icon/Icon';
import type { Access } from '../Access/Access';

export default class Program {
    _id: string;
    _access: Access;
    _name: string;
    _shortName: string;
    _organisationUnits: Object;
    _version: string | number;
    _categoryCombination: ?CategoryCombination;
    _programRules: Array<ProgramRule>;
    _programRuleVariables: Array<ProgramRuleVariable>;
    _icon: Icon;

    constructor(initFn: ?(_this: Program) => void) {
        this.programRules = [];
        this.programRuleVariables = [];
        initFn && isFunction(initFn) && initFn(this);
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

    set organisationUnits(organisationUnits: Object) {
        this._organisationUnits = organisationUnits;
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

    set icon(icon: Icon) {
        this._icon = icon;
    }
    get icon(): Icon {
        return this._icon;
    }

    addProgramRuleVariable(programRuleVariable: ProgramRuleVariable) {
        this.programRuleVariables.push(programRuleVariable);
    }

    addProgramRule(programRule: ProgramRule) {
        this.programRules.push(programRule);
    }

    addProgramRuleVariables(programRuleVariables: Array<ProgramRuleVariable>) {
        this.programRuleVariables = [...this.programRuleVariables, ...programRuleVariables];
    }

    addProgramRules(programRules: Array<ProgramRule>) {
        this.programRules = [...this.programRules, ...programRules];
    }
}
