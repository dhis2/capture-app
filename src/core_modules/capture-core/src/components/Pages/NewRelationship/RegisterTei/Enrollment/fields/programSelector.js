// @flow
import i18n from '@dhis2/d2-i18n';
import {
    placements,
} from '../../../../DataEntry';
import {
    VirtualizedSelectField,
    withSelectTranslations,
    withDefaultShouldUpdateInterface,
    withFocusSaver,
    withDefaultFieldContainer,
    withLabel,
} from '../../../../FormFields/New';
import { programCollection } from '../../../../../../metaDataMemoryStores';

import labelTypeClasses from './fieldLabels.mod.css';
import dataEntrySectionKeys from '../../../../DataEntries/Enrollment/constants/sectionKeys.const';
import { TrackerProgram } from '../../../../../../metaData';

const programsArray = Array.from(programCollection.values());

getOptionsFromPrograms(programs: Array<Program>) {
    return programs
        .map(program => ({
            label: program.name,
            value: program.id,
            // iconLeft: this.getProgramIcon(program),
        }));
}

const getOptions = (selectedOrgUnitId: ?string) => {
    programOptions = this.getOptionsFromPrograms(
        programsArray
            .filter(program =>
                program instanceof TrackerProgram &&
                (!selectedOrgUnitId || program.organisationUnits[selectedOrgUnitId]) && 
                program.access.data.write),
    );
};


const getProgramSelectorSettings = () => {
    const programSelectorComponent =
        withDefaultShouldUpdateInterface()(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withLabel({
                        onGetCustomFieldLabeClass: (props: Object) =>
                            `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.dropdownLabel}`,
                    })(
                        withSelectTranslations()(
                            VirtualizedSelectField,
                        ),
                    ),
                ),
            ),
        );
    /*
    const baseComponentStyles = {
        labelContainerStyle: {
            flexBasis: 200,
        },
        inputContainerStyle: {
            flexBasis: 150,
        },
    };
    */

    const programSelectorSettings = (props: Object) => ({
        component: programSelectorComponent,
        componentProps: {
            ...props,
            width: '100%',
            label: i18n.t('Program'),
            required: false,
            options: getOptions(),
        },
        propName: 'program',
        meta: {
            placement: placements.TOP,
            section: dataEntrySectionKeys.ENROLLMENT,
        },
    });

    return programSelectorSettings;
};