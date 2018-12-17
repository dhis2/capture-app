// @flow
/* eslint-disable no-underscore-dangle */

import log from 'loglevel';
import type {
    CachedProgramStageDataElement,
    CachedSectionDataElements,
    CachedProgramStageSection,
    CachedProgramStage,
    CachedProgramStageDataElementsAsObject,
    CachedOptionSet,
    CachedRelationshipType,
} from '../../../cache.types';
import errorCreator from '../../../../utils/errorCreator';
import Section from '../../../../metaData/RenderFoundation/Section';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';
import CustomForm from '../../../../metaData/RenderFoundation/CustomForm';
import capitalizeFirstLetter from '../../../../utils/string/capitalizeFirstLetter';
import isNonEmptyArray from '../../../../utils/isNonEmptyArray';
import ProgramStage from '../../../../metaData/Program/ProgramStage';
import getCamelCaseUppercaseString from '../../../../utils/string/getCamelCaseFromUppercase';
import DataElementFactory from './DataElementFactory';
import RelationshipTypesFactory from './RelationshipTypesFactory';

type SectionSpecs = {
    id: string,
    displayName: string,
    dataElements: ?Array<CachedSectionDataElements>
};


class ProgramStageFactory {
    static CUSTOM_FORM_TEMPLATE_ERROR = 'Error in custom form template';

    cachedOptionSets: Array<CachedOptionSet>;
    locale: ?string;
    dataElementFactory: DataElementFactory;
    relationshipTypesFactory: RelationshipTypesFactory;

    constructor(
        cachedOptionSets: Array<CachedOptionSet>,
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
        const section = new Section((_this) => {
            _this.id = sectionSpecs.id;
            _this.name = sectionSpecs.displayName;
        });

        if (sectionSpecs.dataElements) {
            // $FlowFixMe
            await sectionSpecs.dataElements.asyncForEach(async (sectionDataElement: CachedSectionDataElements) => {
                const id = sectionDataElement.id;
                const cachedProgramStageDataElement = cachedProgramStageDataElements[id];
                section.addElement(await this.dataElementFactory.build(cachedProgramStageDataElement));
            });
        }

        return section;
    }

    async _buildMainSection(cachedProgramStageDataElements: ?Array<CachedProgramStageDataElement>) {
        const section = new Section((_this) => {
            _this.id = Section.MAIN_SECTION_ID;
        });

        if (cachedProgramStageDataElements) {
            // $FlowFixMe
            await cachedProgramStageDataElements.asyncForEach((async (cachedProgramStageDataElement) => {
                section.addElement(await this.dataElementFactory.build(cachedProgramStageDataElement));
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
            _stage.relationshipTypes = this.relationshipTypesFactory.build(
                programId,
                cachedProgramStage.id,
            );
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
                stageForm.customForm = new CustomForm((_this) => {
                    // $FlowFixMe
                    _this.id = dataEntryForm.id;
                    // $FlowFixMe
                    _this.data = dataEntryForm.htmlCode;
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
            // $FlowSuppress
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
