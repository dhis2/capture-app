// @flow
/* eslint-disable no-underscore-dangle */

import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { capitalizeFirstLetter } from 'capture-core-utils/string/capitalizeFirstLetter';
import { camelCaseUppercaseString } from 'capture-core-utils/string/getCamelCaseFromUppercase';
import type {
    CachedProgramStageDataElement,
    CachedSectionDataElements,
    CachedProgramStageSection,
    CachedProgramStage,
    CachedProgramStageDataElementsAsObject,
    CachedOptionSet,
} from '../../../../storageControllers/cache.types';
import { Section, ProgramStage, RenderFoundation, CustomForm } from '../../../../metaData';
import { buildIcon } from '../../../common/helpers';
import { isNonEmptyArray } from '../../../../utils/isNonEmptyArray';
import { DataElementFactory } from './DataElementFactory';
import { RelationshipTypesFactory } from './RelationshipTypesFactory';
import type { ConstructorInput, SectionSpecs } from './programStageFactory.types';
import { transformEventNode } from '../transformNodeFuntions/transformNodeFunctions';

export class ProgramStageFactory {
    static CUSTOM_FORM_TEMPLATE_ERROR = 'Error in custom form template';

    cachedOptionSets: Map<string, CachedOptionSet>;
    locale: ?string;
    dataElementFactory: DataElementFactory;
    relationshipTypesFactory: RelationshipTypesFactory;

    constructor({
        cachedOptionSets,
        cachedRelationshipTypes,
        locale,
        minorServerVersion,
    }: ConstructorInput) {
        this.cachedOptionSets = cachedOptionSets;
        this.locale = locale;
        this.relationshipTypesFactory = new RelationshipTypesFactory(
            cachedRelationshipTypes,
        );
        this.dataElementFactory = new DataElementFactory(
            cachedOptionSets,
            locale,
            minorServerVersion,
        );
    }

    async _buildSection(
        cachedProgramStageDataElements: CachedProgramStageDataElementsAsObject,
        sectionSpecs: SectionSpecs) {
        const section = new Section((o) => {
            o.id = sectionSpecs.id;
            o.name = sectionSpecs.displayName;
            o.displayDescription = sectionSpecs.displayDescription;
        });

        if (sectionSpecs.dataElements) {
            // $FlowFixMe
            await sectionSpecs.dataElements.asyncForEach(async (sectionDataElement: CachedSectionDataElements) => {
                const id = sectionDataElement.id;
                const cachedProgramStageDataElement = cachedProgramStageDataElements[id];
                if (!cachedProgramStageDataElement) {
                    log.error(
                        errorCreator('could not find programStageDataElement')(
                            { sectionDataElement }));
                    return;
                }
                const element = await this.dataElementFactory.build(cachedProgramStageDataElement, section);
                element && section.addElement(element);
            });
        }

        return section;
    }

    async _buildMainSection(cachedProgramStageDataElements: ?Array<CachedProgramStageDataElement>) {
        const section = new Section((o) => {
            o.id = Section.MAIN_SECTION_ID;
        });

        if (cachedProgramStageDataElements) {
            // $FlowFixMe
            await cachedProgramStageDataElements.asyncForEach((async (cachedProgramStageDataElement) => {
                const element = await this.dataElementFactory.build(cachedProgramStageDataElement, section);
                element && section.addElement(element);
            }));
        }

        return section;
    }

    static _convertProgramStageDataElementsToObject(
        cachedProgramStageDataElements: ?Array<CachedProgramStageDataElement>): CachedProgramStageDataElementsAsObject {
        if (!cachedProgramStageDataElements) {
            return {};
        }

        return cachedProgramStageDataElements.reduce((accObject, d2ProgramStageDataElement) => {
            accObject[d2ProgramStageDataElement.dataElementId] = d2ProgramStageDataElement;
            return accObject;
        }, {});
    }

    static _getFeatureType(cachedProgramStage: CachedProgramStage) {
        return cachedProgramStage.featureType ?
            capitalizeFirstLetter(cachedProgramStage.featureType.toLowerCase())
            :
            'None';
    }

    async build(
        cachedProgramStage: CachedProgramStage,
        programId: string,
    ) {
        const stage = new ProgramStage((_stage) => {
            _stage.id = cachedProgramStage.id;
            _stage.name = cachedProgramStage.displayName;
            _stage.untranslatedName = cachedProgramStage.name;
            _stage.relationshipTypes = this.relationshipTypesFactory.build(
                programId,
                cachedProgramStage.id,
            );
            _stage.enableUserAssignment = !!cachedProgramStage.enableUserAssignment;
            _stage.autoGenerateEvent = !!cachedProgramStage.autoGenerateEvent;
            _stage.allowGenerateNextVisit = !!cachedProgramStage.allowGenerateNextVisit;
            _stage.askCompleteEnrollmentOnEventComplete = !!cachedProgramStage.remindCompleted;
            _stage.access = cachedProgramStage.access;
            _stage.hideDueDate = !!cachedProgramStage.hideDueDate;
            _stage.openAfterEnrollment = !!cachedProgramStage.openAfterEnrollment;
            _stage.generatedByEnrollmentDate = !!cachedProgramStage.generatedByEnrollmentDate;
            _stage.reportDateToUse = cachedProgramStage.reportDateToUse;
            _stage.minDaysFromStart = cachedProgramStage.minDaysFromStart;
            _stage.repeatable = cachedProgramStage.repeatable;
            _stage.stageForm = new RenderFoundation((_form) => {
                _form.id = cachedProgramStage.id;
                _form.name = cachedProgramStage.displayName;
                _form.description = cachedProgramStage.description;
                _form.featureType = ProgramStageFactory._getFeatureType(cachedProgramStage);
                _form.access = cachedProgramStage.access;
                _form.addLabel({ id: 'occurredAt', label: cachedProgramStage.displayExecutionDateLabel || 'Report date' });
                _form.addLabel({ id: 'scheduledAt', label: cachedProgramStage.displayDueDateLabel || 'Scheduled date' });
                _form.validationStrategy =
                    cachedProgramStage.validationStrategy &&
                    camelCaseUppercaseString(cachedProgramStage.validationStrategy);
            });
            _stage.icon = buildIcon(cachedProgramStage.style);
        });

        const stageForm = stage.stageForm;

        if (cachedProgramStage.formType === 'CUSTOM' && cachedProgramStage.dataEntryForm) {
            const section = await this._buildMainSection(cachedProgramStage.programStageDataElements);
            section.showContainer = false;
            stageForm.addSection(section);
            const dataEntryForm = cachedProgramStage.dataEntryForm;
            try {
                section.customForm = new CustomForm((o) => {
                    // $FlowFixMe
                    o.id = dataEntryForm.id;
                });
                // $FlowFixMe : Require input from class
                section.customForm.setData(dataEntryForm.htmlCode, transformEventNode);
            } catch (error) {
                log.error(errorCreator(ProgramStageFactory.CUSTOM_FORM_TEMPLATE_ERROR)(
                    // $FlowFixMe
                    { template: dataEntryForm.htmlCode, error }));
            }
        } else if (isNonEmptyArray(cachedProgramStage.programStageSections)) {
            const cachedProgramStageDataElementsAsObject =
                ProgramStageFactory._convertProgramStageDataElementsToObject(
                    cachedProgramStage.programStageDataElements,
                );

            // $FlowFixMe[prop-missing] automated comment
            // $FlowFixMe[incompatible-use] automated comment
            await cachedProgramStage.programStageSections.asyncForEach(async (section: CachedProgramStageSection) => {
                stageForm.addSection(await this._buildSection(cachedProgramStageDataElementsAsObject, {
                    id: section.id,
                    displayName: section.displayName,
                    displayDescription: section.displayDescription,
                    dataElements: section.dataElements,
                }));
            });
        } else {
            stageForm.addSection(await this._buildMainSection(cachedProgramStage.programStageDataElements));
        }

        return stage;
    }
}
