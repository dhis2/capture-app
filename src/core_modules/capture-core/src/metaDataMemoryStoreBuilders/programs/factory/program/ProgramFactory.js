// @flow
/* eslint-disable complexity */
/* eslint-disable no-underscore-dangle */
import {
    TrackedEntityType,
    Program,
    Icon,
    EventProgram,
    TrackerProgram,
    CategoryCombination,
    Category,
} from '../../../../metaData';

import getProgramIconAsync from './getProgramIcon';
import buildSearchGroups from './searchGroupFactory';
import { buildEnrollment } from '../enrollment';
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

    constructor(
        cachedOptionSets: Array<CachedOptionSet>,
        cachedRelationshipTypes: Array<CachedRelationshipType>,
        cachedTrackedEntityAttributes: Array<CachedTrackedEntityAttribute>,
        trackedEntityTypeCollection: Map<string, TrackedEntityType>,
        locale: ?string,
    ) {
        this.programStageFactory = new ProgramStageFactory(
            cachedOptionSets,
            cachedRelationshipTypes,
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
                _this.trackedEntityType = cachedProgram.trackedEntityType;
            });

            // program.searchGroups = await buildSearchGroups(d2Program, this.locale);
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

            // program.enrollment = await buildEnrollment(d2Program, this.cachedOptionSets, this.locale);
        }
        // $FlowFixMe
        program.icon = await ProgramFactory._buildProgramIcon(cachedProgram.style);

        return program;
    }
}

export default ProgramFactory;
