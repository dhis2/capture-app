import React from 'react';
import { withStyles, createStyles, type WithStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { LinkButton } from '../../../../../../Buttons/LinkButton.component';
import { ProgramFilterer } from '../../../../../../ProgramFilterer';
import { TrackerProgram } from '../../../../../../../metaData';
import {
    VirtualizedSelectField,
    withSelectTranslations,
    withFocusSaver,
    withDefaultFieldContainer,
    withLabel,
    withFilterProps,
} from '../../../../../../FormFields/New';
import { NonBundledDhis2Icon } from '../../../../../../NonBundledDhis2Icon';
import type { Program } from '../../../../../../../metaData';
import type { ComposedProgramSelectorProps, ProgramOption } from './ProgramSelector.types';

const styles = createStyles({
    iconContainer: {
        display: 'flex',
        alignItems: 'center',
        paddingRight: 5,
    },
    icon: {
        width: 22,
        height: 22,
        borderRadius: 2,
    },
    isFilteredContainer: {
        fontSize: 12,
        color: '#494949',
        paddingTop: 5,
    },
    isFilteredLink: {
        paddingLeft: 2,
        backgroundColor: 'inherit',
    },
});

type Props = ComposedProgramSelectorProps & WithStyles<typeof styles>;

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

    renderIsFilteredText() {
        const { classes, onClearFilter } = this.props;
        return (
            <div
                className={classes.isFilteredContainer}
            >
                {i18n.t('Some programs are being filtered.')}
                <LinkButton
                    className={classes.isFilteredLink}
                    onClick={onClearFilter}
                >
                    {i18n.t('Show all')}
                </LinkButton>
            </div>

    );
    }

    baseLineFilter = (program: Program) => {
        const { trackedEntityTypeId } = this.props;

        const isValid = program instanceof TrackerProgram &&
        program.trackedEntityType.id === trackedEntityTypeId &&
        program.access.data.write;

        return isValid;
    }
    
    getOptionsFromPrograms = (programs: Program[]): ProgramOption[] =>
        programs
            .map(program => ({
                label: program.name,
                value: program.id,
                iconLeft: this.getProgramIcon(program),
            }));

    render() {
        const { classes, orgUnitIds, onUpdateSelectedProgram, onClearFilter, ...passOnProps } = this.props;
        return (
            <ProgramFilterer
                orgUnitIds={orgUnitIds || null}
                baselineFilter={this.baseLineFilter}
            >
                {
                    (programs, isFiltered) => (
                        <div>
                            <VirtualizedSelectField
                                options={this.getOptionsFromPrograms(programs)}
                                required={false}
                                onSelect={onUpdateSelectedProgram}
                                {...passOnProps}
                            />
                            {isFiltered ? this.renderIsFilteredText() : null }
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
                    withSelectTranslations()(
                        withStyles(styles)(
                            ProgramSelector,
                        ),
                    ),
                ),
            ),
        ),
    );
