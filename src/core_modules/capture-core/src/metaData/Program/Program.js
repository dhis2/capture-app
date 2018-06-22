// @flow
/* eslint-disable no-underscore-dangle */
import isFunction from 'd2-utilizr/src/isFunction';

import Category from '../CategoryCombinations/Category';
import type { ProgramRule, ProgramRuleVariable } from '../../RulesEngine/rulesEngine.types';

export default class Program {
    _id: string;
    _name: string;
    _shortName: string;
    _version: string | number;
    _categories: ?Array<Category>;
    _programRules: Array<ProgramRule>;
    _programRuleVariables: Array<ProgramRuleVariable>;

    constructor(initFn: ?(_this: Program) => void) {
        initFn && isFunction(initFn) && initFn(this);
        this.programRules = [];
        this.programRuleVariables = [];
    }

    set id(id: string): void {
        this._id = id;
    }
    get id(): string {
        return this._id;
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

    set categories(categories: ?Array<Category>) {
        this._categories = categories;
    }
    get categories(): ?Array<Category> {
        return this._categories;
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
