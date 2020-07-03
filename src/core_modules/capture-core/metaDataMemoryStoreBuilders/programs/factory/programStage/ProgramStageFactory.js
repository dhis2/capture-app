// @flow
/* eslint-disable no-underscore-dangle */

import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import capitalizeFirstLetter from 'capture-core-utils/string/capitalizeFirstLetter';
import getCamelCaseUppercaseString from 'capture-core-utils/string/getCamelCaseFromUppercase';
import type {
    CachedProgramStageDataElement,
    CachedSectionDataElements,
    CachedProgramStageSection,
    CachedProgramStage,
    CachedProgramStageDataElementsAsObject,
    CachedOptionSet,
    CachedRelationshipType,
} from '../../../../storageControllers/cache.types';
import Section from '../../../../metaData/RenderFoundation/Section';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';
import CustomForm from '../../../../metaData/RenderFoundation/CustomForm';
import isNonEmptyArray from '../../../../utils/isNonEmptyArray';
import ProgramStage from '../../../../metaData/Program/ProgramStage';
import DataElementFactory from './DataElementFactory';
import RelationshipTypesFactory from './RelationshipTypesFactory';

type SectionSpecs = {
    id: string,
    displayName: string,
    dataElements: ?Array<CachedSectionDataElements>
};


class ProgramStageFactory {
    static CUSTOM_FORM_TEMPLATE_ERROR = 'Error in custom form template';

    cachedOptionSets: Map<string, CachedOptionSet>;
    locale: ?string;
    dataElementFactory: DataElementFactory;
    relationshipTypesFactory: RelationshipTypesFactory;

    constructor(
        cachedOptionSets: Map<string, CachedOptionSet>,
        cachedRelationshipTypes: Array<CachedRelationshipType>,
        locale: ?string,
    ) {
        this.cachedOptionSets = cachedOptionSets;
        this.locale = locale;
        this.relationshipTypesFactory = new RelationshipTypesFactory(
            cachedRelationshipTypes,
        );
        this.dataElementFactory = new DataElementFactory(
            cachedOptionSets,
            locale,
        );
    }

    async _buildSection(
        cachedProgramStageDataElements: CachedProgramStageDataElementsAsObject,
        sectionSpecs: SectionSpecs) {
        const section = new Section((o) => {
            o.id = sectionSpecs.id;
            o.name = sectionSpecs.displayName;
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
                const element = await this.dataElementFactory.build(cachedProgramStageDataElement);
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
                const element = await this.dataElementFactory.build(cachedProgramStageDataElement);
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
            accObject[d2ProgramStageDataElement.dataElement.id] = d2ProgramStageDataElement;
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
            _stage.relationshipTypes = this.relationshipTypesFactory.build(
                programId,
                cachedProgramStage.id,
            );
            _stage.enableUserAssignment = !!cachedProgramStage.enableUserAssignment;
            _stage.stageForm = new RenderFoundation((_form) => {
                _form.id = cachedProgramStage.id;
                _form.name = cachedProgramStage.displayName;
                _form.description = cachedProgramStage.description;
                _form.featureType = ProgramStageFactory._getFeatureType(cachedProgramStage);
                _form.access = cachedProgramStage.access;
                _form.addLabel({ id: 'eventDate', label: cachedProgramStage.executionDateLabel || 'Incident date' });
                _form.validationStrategy =
                    cachedProgramStage.validationStrategy &&
                    getCamelCaseUppercaseString(cachedProgramStage.validationStrategy);
            });
        });

        const stageForm = stage.stageForm;

        if (cachedProgramStage.formType === 'CUSTOM' && cachedProgramStage.dataEntryForm) {
            const section = await this._buildMainSection(cachedProgramStage.programStageDataElements);
            section.showContainer = false;
            stageForm.addSection(section);
            const dataEntryForm = cachedProgramStage.dataEntryForm;
            try {
                stageForm.customForm = new CustomForm((o) => {
                    // $FlowFixMe
                    o.id = dataEntryForm.id;
                    // $FlowFixMe
                    o.data = dataEntryForm.htmlCode;
                });
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
                    dataElements: section.dataElements,
                }));
            });
        } else {
            stageForm.addSection(await this._buildMainSection(cachedProgramStage.programStageDataElements));
        }

        return stage;
    }
}

export default ProgramStageFactory;
