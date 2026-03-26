/* eslint-disable complexity */
/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import {
    EventProgram,
    TrackerProgram,
    CategoryCombination,
    type TrackedEntityType,
    type Category,
} from '../../../../metaData';
import { getUserMetadataStorageController, USER_METADATA_STORES } from '../../../../storageControllers';
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
} from '../../../../storageControllers';

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
        locale: string | null,
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
        cachedProgramCategories: Array<ProgramCachedCategory> | null): Map<string, Category> {
        return new Map(
            cachedProgramCategories
                ?.map(cachedProgramCategory => ([
                    cachedProgramCategory.id,
                    this.categoryFactory.build(cachedProgramCategory),
                ])),
        );
    }

    _buildCategoryCombination(
        cachedCategoryCombination: ProgramCachedCategoryCombo | null,
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
                this._buildCategories(cachedCategoryCombination.categories);
        });
    }

    async _buildProgramAttributes(cachedProgramTrackedEntityAttributes: Array<CachedProgramTrackedEntityAttribute>) {
        const attributePromises = cachedProgramTrackedEntityAttributes.map(async (ptea) => {
            const dataElement = await this.dataElementFactory.build(ptea);
            return dataElement;
        });

        const attributes = await Promise.all(attributePromises);

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

            // Future: would be a good idea to use Zod here for schema validatons
            if (!d2Stage) {
                log.error(
                    errorCreator('Invalid event program (program stage is missing)')(
                        { program: cachedProgram }));
                return null;
            }
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
                o.trackedEntityType = this.trackedEntityTypeCollection.get(
                    cachedProgram.trackedEntityTypeId!,
                ) as TrackedEntityType;
            });

            if (cachedProgram.programTrackedEntityAttributes) {
                program.searchGroups = await this.searchGroupFactory.build(
                    cachedProgram.programTrackedEntityAttributes,
                    cachedProgram.minAttributesRequiredToSearch,
                );

                program.attributes = await this._buildProgramAttributes(cachedProgram.programTrackedEntityAttributes);
            }

            // @ts-expect-error - keeping original functionality as before ts rewrite
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
        program.organisationUnits = (await getUserMetadataStorageController().get(
            USER_METADATA_STORES.ORGANISATION_UNITS_BY_PROGRAM,
            program.id,
        ))?.organisationUnits;
        program.icon = buildIcon(cachedProgram.style);
        program.displayFrontPageList = cachedProgram.displayFrontPageList;
        program.onlyEnrollOnce = cachedProgram.onlyEnrollOnce;
        program.useFirstStageDuringRegistration = cachedProgram.useFirstStageDuringRegistration;

        return program;
    }
}
