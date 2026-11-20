import * as React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { ProgramFilterer } from '../../../../../ProgramFilterer';
import type { Program } from '../../../../../../metaData';
import { TrackerProgram } from '../../../../../../metaData';
import {
    SingleSelectField,
    withSelectSingleTranslations,
    withFocusSaver,
    withDefaultFieldContainer,
    withLabel,
    withFilterProps,
} from '../../../../../FormFields/New';
import { NonBundledDhis2Icon } from '../../../../../NonBundledDhis2Icon';

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

type Option = {
    label: string;
    value: string;
    iconLeft?: React.ReactNode | null;
};

type Props = {
    value: string;
    trackedEntityTypeId: string;
    onUpdateSelectedProgram: (programId: string) => void;
} & WithStyles<typeof getStyles>;

class ProgramSelector extends React.Component<Props> {
    getOptionsFromPrograms = (programs: Array<Program>): Array<Option> =>
        programs
            .map(program => ({
                label: program.name,
                value: program.id,
                iconLeft: this.getProgramIcon(program),
            }));

    getProgramIcon({ icon, name: programName }: Program) {
        if (!icon) {
            return null;
        }
        const { color, name } = icon;
        const { classes } = this.props;

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

    baseLineFilter = (program: Program) => {
        const { trackedEntityTypeId } = this.props;

        return program instanceof TrackerProgram &&
        program.trackedEntityType.id === trackedEntityTypeId &&
        program.access.data.write;
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
                onGetCustomFieldLabeClass: (props: any) =>
                    props.programLabelClass,
            })(
                withFilterProps((props: any) => {
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
