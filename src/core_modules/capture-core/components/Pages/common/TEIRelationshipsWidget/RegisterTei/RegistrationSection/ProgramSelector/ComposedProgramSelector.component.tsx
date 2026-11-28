import React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { ProgramFilterer } from '../../../../../../ProgramFilterer';
import { TrackerProgram } from '../../../../../../../metaData';
import {
    SingleSelectField,
    withSelectSingleTranslations,
    withFocusSaver,
    withDefaultFieldContainer,
    withLabel,
    withFilterProps,
} from '../../../../../../FormFields/New';
import { NonBundledDhis2Icon } from '../../../../../../NonBundledDhis2Icon';
import type { Program } from '../../../../../../../metaData';
import type { ComposedProgramSelectorProps, ProgramOption } from './ProgramSelector.types';

const getStyles = () => ({
    iconContainer: {
        display: 'flex',
        alignItems: 'center',
        paddingInlineEnd: 5,
    },
    icon: {
        width: 22,
        height: 22,
        borderRadius: 2,
    },
});

type Props = ComposedProgramSelectorProps & WithStyles<typeof getStyles>;

class ProgramSelector extends React.Component<Props> {
    getProgramIcon(program: Program) {
        const icon = program.icon || {};
        const { color = '', name = '' } = icon as { color?: string; name?: string };
        const { classes } = this.props;
        const programName = program.name;

        return (
            <div
                className={classes.iconContainer}
            >
                <NonBundledDhis2Icon
                    name={name || 'clinical_fe_outline'}
                    color={color || '#e0e0e0'}
                    alternativeText={programName}
                    width={22}
                    height={22}
                    cornerRadius={2}
                />
            </div>
        );
    }

    getOptionsFromPrograms = (programs: Program[]): ProgramOption[] =>
        programs
            .map(program => ({
                label: program.name,
                value: program.id,
                iconLeft: this.getProgramIcon(program),
            }));

    baseLineFilter = (program: Program) => {
        const { trackedEntityTypeId } = this.props;

        const isValid = program instanceof TrackerProgram &&
        program.trackedEntityType.id === trackedEntityTypeId &&
        program.access.data.write;

        return isValid;
    }

    render() {
        const { classes, onUpdateSelectedProgram, ...passOnProps } = this.props;
        return (
            <ProgramFilterer
                baselineFilter={this.baseLineFilter}
            >
                {
                    (programs: Program[]) => (
                        <div>
                            <SingleSelectField
                                options={this.getOptionsFromPrograms(programs)}
                                required={false}
                                onChange={onUpdateSelectedProgram}
                                {...passOnProps as any}
                            />
                        </div>
                    )
                }
            </ProgramFilterer>
        );
    }
}

export const ComposedProgramSelector =
    withFocusSaver()(
        withDefaultFieldContainer()(
            withLabel({
                onGetCustomFieldLabeClass: (props: Record<string, any>) =>
                    props.programLabelClass,
            })(
                withFilterProps((props: Record<string, any>) => {
                    const { programLabelClass, ...passOnProps } = props;
                    return passOnProps;
                })(
                    withSelectSingleTranslations()(
                        withStyles(getStyles)(
                            ProgramSelector,
                        ),
                    ),
                ),
            ),
        ),
    );
