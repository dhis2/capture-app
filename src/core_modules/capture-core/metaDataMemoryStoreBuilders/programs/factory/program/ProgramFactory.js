// @flow
/* eslint-disable complexity */
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import {
    TrackedEntityType,
    Icon,
    EventProgram,
    TrackerProgram,
    CategoryCombination,
    Category,
    CategoryOption,
} from '../../../../metaData';

import getProgramIconAsync from './getProgramIcon';
import { SearchGroupFactory } from '../../../common/factory';
import { EnrollmentFactory } from '../enrollment';
import DataElementFactory from '../enrollment/DataElementFactory';
import {
    ProgramStageFactory,
} from '../programStage';

import type {
    CachedStyle,
    CachedProgramStage,
    ProgramCachedCategoryCombo,
    ProgramCachedCategory,
    CachedCategory,
    CachedCategoryOption,
    CachedProgram,
    CachedOptionSet,
    CachedRelationshipType,
    CachedTrackedEntityAttribute,
    CachedTrackedEntityType,
    CachedProgramTrackedEntityAttribute,
} from '../../../../storageControllers/cache.types';

class ProgramFactory {
    static _buildCategoryOptions(cachedCategoryOptions: Array<CachedCategoryOption>): Map<string, CategoryOption> {
        return cachedCategoryOptions.reduce((accCategoryOptionsMap, cachedOption) => {
            accCategoryOptionsMap.set(cachedOption.id, new CategoryOption((_this) => {
                _this.id = cachedOption.id;
                _this.name = cachedOption.displayName;
                _this.organisationUnitIds = cachedOption.organisationUnitIds;
                _this.access = cachedOption.access;
            }));
            return accCategoryOptionsMap;
        }, new Map());
    }

    static _buildCategories(
        cachedProgramCategories: Array<ProgramCachedCategory>,
        cachedCategories: {[categoryId: string]: CachedCategory}): Map<string, Category> {
        return new Map(
            cachedProgramCategories
                .map(cachedProgramCategory => ([
                    cachedProgramCategory.id,
                    new Category((_this) => {
                        const id = cachedProgramCategory.id;
                        _this.id = id;
                        const cachedCategory = cachedCategories[id];
                        if (!cachedCategory) {
                            log.error(errorCreator('Could not retrieve cachedCategory')({ id }));
                            _this.categoryOptions = new Map();
                        } else {
                            _this.name = cachedCategory.displayName;
                            _this.categoryOptions =
                                ProgramFactory._buildCategoryOptions(cachedCategory.categoryOptions);
                        }
                    }),
                ])),
        );
    }

    programStageFactory: ProgramStageFactory;
    enrollmentFactory: EnrollmentFactory;
    searchGroupFactory: SearchGroupFactory;
    dataElementFactory: DataElementFactory;
    trackedEntityTypeCollection: Map<string, TrackedEntityType>;
    cachedCategories: {[categoryId: string]: CachedCategory};

    constructor(
        cachedOptionSets: Map<string, CachedOptionSet>,
        cachedRelationshipTypes: Array<CachedRelationshipType>,
        cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
        cachedTrackedEntityTypes: Map<string, CachedTrackedEntityType>,
        cachedCategories: {[categoryId: string]: CachedCategory},
        trackedEntityTypeCollection: Map<string, TrackedEntityType>,
        locale: ?string,
    ) {
        this.trackedEntityTypeCollection = trackedEntityTypeCollection;
        this.cachedCategories = cachedCategories;
        this.programStageFactory = new ProgramStageFactory(
            cachedOptionSets,
            cachedRelationshipTypes,
            locale,
        );
        this.enrollmentFactory = new EnrollmentFactory(
            cachedTrackedEntityAttributes,
            cachedOptionSets,
            cachedTrackedEntityTypes,
            locale,
            trackedEntityTypeCollection,
        );
        this.searchGroupFactory = new SearchGroupFactory(
            cachedTrackedEntityAttributes,
            locale,
        );
        this.dataElementFactory = new DataElementFactory(
            cachedTrackedEntityAttributes,
            cachedOptionSets,
            locale,
        );
    }

    _buildCategoryCombination(
        cachedCategoryCombination: ?ProgramCachedCategoryCombo,
    ) {
        if (!(
            cachedCategoryCombination &&
            !cachedCategoryCombination.isDefault &&
            cachedCategoryCombination.categories &&
            cachedCategoryCombination.categories.length > 0
        )) {
            return null;
        }

        return new CategoryCombination((_this) => {
            // $FlowFixMe
            _this.name = cachedCategoryCombination.displayName;
            // $FlowFixMe
            _this.id = cachedCategoryCombination.id;
            _this.categories =
            // $FlowFixMe
                ProgramFactory._buildCategories(cachedCategoryCombination.categories, this.cachedCategories);
        });
    }

    static async _buildProgramIcon(cachedStyle: CachedStyle = {}) {
        const icon = new Icon();
        icon.color = cachedStyle.color || '#e0e0e0';
        icon.data = await getProgramIconAsync(cachedStyle.icon);
        return icon;
    }

    async _buildProgramAttributes(cachedProgramTrackedEntityAttributes: Array<CachedProgramTrackedEntityAttribute>) {
        const attributePromises = cachedProgramTrackedEntityAttributes.map(async (ptea) => {
            const dataElement = await this.dataElementFactory.build(ptea);
            return dataElement;
        });

        const attributes = await Promise.all(attributePromises);
        return attributes;
    }

    async build(cachedProgram: CachedProgram) {
        let program;
        if (cachedProgram.programType === 'WITHOUT_REGISTRATION') {
            program = new EventProgram((_this) => {
                _this.id = cachedProgram.id;
                _this.access = cachedProgram.access;
                _this.name = cachedProgram.displayName;
                _this.shortName = cachedProgram.displayShortName;
                _this.organisationUnits = cachedProgram.organisationUnits;
                _this.categoryCombination = this._buildCategoryCombination(cachedProgram.categoryCombo);
            });
            const d2Stage = cachedProgram.programStages && cachedProgram.programStages[0];
            program.stage =
                await this.programStageFactory.build(
                    d2Stage,
                    program.id,
                );
        } else {
            program = new TrackerProgram((_this) => {
                _this.id = cachedProgram.id;
                _this.access = cachedProgram.access;
                _this.name = cachedProgram.displayName;
                _this.shortName = cachedProgram.displayShortName;
                _this.organisationUnits = cachedProgram.organisationUnits;
                // $FlowFixMe
                _this.trackedEntityType = this.trackedEntityTypeCollection.get(cachedProgram.trackedEntityTypeId);
            });

            if (cachedProgram.programTrackedEntityAttributes) {
                program.searchGroups = await this.searchGroupFactory.build(
                    cachedProgram.programTrackedEntityAttributes,
                    cachedProgram.minAttributesRequiredToSearch,
                );

                // $FlowFixMe
                program.attributes = await this._buildProgramAttributes(cachedProgram.programTrackedEntityAttributes);
            }

            // $FlowFixMe
            await cachedProgram.programStages.asyncForEach(async (cachedProgramStage: CachedProgramStage) => {
                // $FlowFixMe
                program.addStage(
                    await this.programStageFactory.build(
                        cachedProgramStage,
                        program.id,
                    ),
                );
            });

            program.enrollment = await this.enrollmentFactory.build(cachedProgram, program.searchGroups);
        }
        // $FlowFixMe
        program.icon = await ProgramFactory._buildProgramIcon(cachedProgram.style);

        return program;
    }
}

export default ProgramFactory;
