// @flow
/* eslint-disable complexity */
/* eslint-disable no-underscore-dangle */
import {
    TrackedEntityType,
    Icon,
    EventProgram,
    TrackerProgram,
    CategoryCombination,
    Category,
} from '../../../../metaData';

import getProgramIconAsync from './getProgramIcon';
import { SearchGroupFactory } from '../../../common/factory';
import { EnrollmentFactory } from '../enrollment';
import {
    ProgramStageFactory,
} from '../programStage';

import type {
    CachedStyle,
    CachedProgramStage,
    CachedCategory,
    CachedCategoryCombo,
    CachedProgram,
    CachedOptionSet,
    CachedRelationshipType,
    CachedTrackedEntityAttribute,
} from '../../../cache.types';

class ProgramFactory {
    programStageFactory: ProgramStageFactory;
    enrollmentFactory: EnrollmentFactory;
    searchGroupFactory: SearchGroupFactory;
    trackedEntityTypeCollection: Map<string, TrackedEntityType>;

    constructor(
        cachedOptionSets: Map<string, CachedOptionSet>,
        cachedRelationshipTypes: Array<CachedRelationshipType>,
        cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
        trackedEntityTypeCollection: Map<string, TrackedEntityType>,
        locale: ?string,
    ) {
        this.trackedEntityTypeCollection = trackedEntityTypeCollection;
        this.programStageFactory = new ProgramStageFactory(
            cachedOptionSets,
            cachedRelationshipTypes,
            locale,
        );
        this.enrollmentFactory = new EnrollmentFactory(
            cachedTrackedEntityAttributes,
            cachedOptionSets,
            locale,
            trackedEntityTypeCollection,
        );
        this.searchGroupFactory = new SearchGroupFactory(
            cachedTrackedEntityAttributes,
            locale,
        );
    }

    static _buildCategories(cachedCategories: Array<CachedCategory>): Array<Category> {
        return cachedCategories
            .map(cachedCategory =>
                new Category((_this) => {
                    _this.id = cachedCategory.id;
                    _this.name = cachedCategory.displayName;
                    _this.categoryOptions = cachedCategory.categoryOptions ?
                        cachedCategory.categoryOptions.map(cachedOption => ({
                            id: cachedOption.id,
                            name: cachedOption.displayName,
                        })) : null;
                }),
            );
    }

    static _buildCategoriCombination(
        cachedCategoriCombination: ?CachedCategoryCombo,
    ) {
        if (!(
            cachedCategoriCombination &&
            !cachedCategoriCombination.isDefault &&
            cachedCategoriCombination.categories &&
            cachedCategoriCombination.categories.length > 0
        )) {
            return null;
        }

        return new CategoryCombination((_this) => {
            // $FlowSuppress
            _this.name = cachedCategoriCombination.displayName;
            // $FlowSuppress
            _this.id = cachedCategoriCombination.id;
            // $FlowSuppress
            _this.categories = ProgramFactory._buildCategories(cachedCategoriCombination.categories);
        });
    }

    static async _buildProgramIcon(cachedStyle: CachedStyle = {}) {
        const icon = new Icon();
        icon.color = cachedStyle.color || '#e0e0e0';
        icon.data = await getProgramIconAsync(cachedStyle.icon);
        return icon;
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
                _this.categoryCombination = ProgramFactory._buildCategoriCombination(cachedProgram.categoryCombo);
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

            program.enrollment = await this.enrollmentFactory.build(cachedProgram);
        }
        // $FlowFixMe
        program.icon = await ProgramFactory._buildProgramIcon(cachedProgram.style);

        return program;
    }
}

export default ProgramFactory;
