// @flow
/* eslint-disable complexity */
/* eslint-disable no-underscore-dangle */
import {
    EventProgram,
    TrackerProgram,
    CategoryCombination,
    type TrackedEntityType,
    type Category,
} from '../../../../metaData';
import { getUserStorageController } from '../../../../storageControllers';
import { userStores } from '../../../../storageControllers/stores';
import { SearchGroupFactory } from '../../../common/factory';
import { buildIcon } from '../../../common/helpers';
import { EnrollmentFactory } from '../enrollment';
import { DataElementFactory } from '../enrollment/DataElementFactory';
import {
    ProgramStageFactory,
} from '../programStage';
import { CategoryFactory } from '../category';

import type
{
    CachedProgramStage,
    ProgramCachedCategoryCombo,
    CachedProgram,
    ProgramCachedCategory,
    CachedCategory,
    CachedOptionSet,
    CachedRelationshipType,
    CachedTrackedEntityAttribute,
    CachedTrackedEntityType,
    CachedProgramTrackedEntityAttribute,
} from '../../../../storageControllers/cache.types';

export class ProgramFactory {
    programStageFactory: ProgramStageFactory;
    enrollmentFactory: EnrollmentFactory;
    searchGroupFactory: SearchGroupFactory;
    dataElementFactory: DataElementFactory;
    categoryFactory: CategoryFactory;
    trackedEntityTypeCollection: Map<string, TrackedEntityType>;

    constructor(
        cachedOptionSets: Map<string, CachedOptionSet>,
        cachedRelationshipTypes: Array<CachedRelationshipType>,
        cachedTrackedEntityAttributes: Map<string, CachedTrackedEntityAttribute>,
        cachedTrackedEntityTypes: Map<string, CachedTrackedEntityType>,
        cachedCategories: {[categoryId: string]: CachedCategory},
        trackedEntityTypeCollection: Map<string, TrackedEntityType>,
        locale: ?string,
        minorServerVersion: number,
    ) {
        this.trackedEntityTypeCollection = trackedEntityTypeCollection;
        this.programStageFactory = new ProgramStageFactory({
            cachedOptionSets,
            cachedRelationshipTypes,
            locale,
            minorServerVersion,
        });
        this.enrollmentFactory = new EnrollmentFactory({
            cachedTrackedEntityAttributes,
            cachedOptionSets,
            cachedTrackedEntityTypes,
            trackedEntityTypeCollection,
            locale,
            minorServerVersion,
        });
        this.searchGroupFactory = new SearchGroupFactory({
            cachedTrackedEntityAttributes,
            cachedOptionSets,
            locale,
        });
        this.dataElementFactory = new DataElementFactory({
            cachedTrackedEntityAttributes,
            cachedOptionSets,
            locale,
            minorServerVersion,
        });
        this.categoryFactory = new CategoryFactory(
            cachedCategories,
        );
    }

    _buildCategories(
        cachedProgramCategories: Array<ProgramCachedCategory>): Map<string, Category> {
        return new Map(
            cachedProgramCategories
                .map(cachedProgramCategory => ([
                    cachedProgramCategory.id,
                    this.categoryFactory.build(cachedProgramCategory),
                ])),
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

        return new CategoryCombination((o) => {
            o.name = cachedCategoryCombination.displayName;
            o.id = cachedCategoryCombination.id;
            o.categories =
            // $FlowFixMe
                this._buildCategories(cachedCategoryCombination.categories, this.cachedCategories);
        });
    }

    async _buildProgramAttributes(cachedProgramTrackedEntityAttributes: Array<CachedProgramTrackedEntityAttribute>) {
        const attributePromises = cachedProgramTrackedEntityAttributes.map(async (ptea) => {
            // $FlowFixMe[incompatible-call] automated comment
            const dataElement = await this.dataElementFactory.build(ptea);
            return dataElement;
        });

        const attributes = await Promise.all(attributePromises);

        // $FlowFixMe[missing-annot]
        return attributes.filter(attribute => attribute);
    }

    async build(cachedProgram: CachedProgram) {
        let program;
        if (cachedProgram.programType === 'WITHOUT_REGISTRATION') {
            program = new EventProgram((o) => {
                o.id = cachedProgram.id;
                o.access = cachedProgram.access;
                o.name = cachedProgram.displayName;
                o.shortName = cachedProgram.displayShortName;
                o.categoryCombination = this._buildCategoryCombination(cachedProgram.categoryCombo);
            });
            const d2Stage = cachedProgram.programStages && cachedProgram.programStages[0];
            program.stage =
                await this.programStageFactory.build(
                    d2Stage,
                    program.id,
                );
        } else {
            program = new TrackerProgram((o) => {
                o.id = cachedProgram.id;
                o.access = cachedProgram.access;
                o.name = cachedProgram.displayName;
                o.shortName = cachedProgram.displayShortName;
                // $FlowFixMe
                o.trackedEntityType = this.trackedEntityTypeCollection.get(cachedProgram.trackedEntityTypeId);
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
                program.addStage(
                    await this.programStageFactory.build(
                        cachedProgramStage,
                        program.id,
                    ),
                );
            });

            program.enrollment = await this.enrollmentFactory.build(cachedProgram, program.searchGroups);
        }
        program.organisationUnits = (await getUserStorageController().get(userStores.ORGANISATION_UNITS_BY_PROGRAM, program.id))?.organisationUnits;
        program.icon = buildIcon(cachedProgram.style);
        program.displayFrontPageList = cachedProgram.displayFrontPageList;
        program.onlyEnrollOnce = cachedProgram.onlyEnrollOnce;
        program.useFirstStageDuringRegistration = cachedProgram.useFirstStageDuringRegistration;

        return program;
    }
}
