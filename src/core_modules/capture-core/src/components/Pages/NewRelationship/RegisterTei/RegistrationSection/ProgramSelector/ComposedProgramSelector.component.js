// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import LinkButton from '../../../../../Buttons/LinkButton.component';
import { ProgramFilterer } from '../../../../../ProgramFilterer';
import { Program, TrackerProgram } from '../../../../../../metaData';
import {
    VirtualizedSelectField,
    withSelectTranslations,
    withFocusSaver,
    withDefaultFieldContainer,
    withLabel,
    withFilterProps,
} from '../../../../../FormFields/New';

const getStyles = (theme: Theme) => ({
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
        color: theme.palette.grey.dark,
        paddingTop: 5,
    },
    isFilteredLink: {
        paddingLeft: 2,
        backgroundColor: 'inherit',
    },
});

type Option = {
    label: string,
    value: string,
    iconLeft?: ?React.Node,
};

type Props = {
    orgUnitIds: ?Array<string>,
    value: string,
    classes: Object,
    onUpdateSelectedProgram: (programId: string) => void,
    onClearFilter: () => void,
};

class ProgramSelector extends React.Component<Props> {
    static baseLineFilter(program: Program) {
        return program instanceof TrackerProgram &&
        program.access.data.write;
    }

    getProgramIcon(program: Program) {
        const classes = this.props.classes;
        return program.icon.data
            ? (
                <div
                    className={classes.iconContainer}
                >
                    <img
                        style={{ backgroundColor: program.icon.color }}
                        className={classes.icon}
                        src={program.icon.data}
                        alt={program.name}
                    />
                </div>
            )
            : null;
    }

    getOptionsFromPrograms = (programs: Array<Program>): Array<Option> =>
        programs
            .map(program => ({
                label: program.name,
                value: program.id,
                iconLeft: this.getProgramIcon(program),
            }));


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

    render() {
        const { classes, orgUnitIds, onUpdateSelectedProgram, onClearFilter, ...passOnProps } = this.props;
        return (
            <ProgramFilterer
                orgUnitIds={orgUnitIds}
                baselineFilter={ProgramSelector.baseLineFilter}
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

const ComposedProgramSelector =
    withFocusSaver()(
        withDefaultFieldContainer()(
            withLabel({
                onGetCustomFieldLabeClass: (props: Object) =>
                    props.programLabelClass,
            })(
                withFilterProps((props: Object) => {
                    const { programLabelClass, ...passOnProps } = props;
                    return passOnProps;
                })(
                    withSelectTranslations()(
                        withStyles(getStyles)(
                            ProgramSelector,
                        ),
                    ),
                ),
            ),
        ),
    );

export default ComposedProgramSelector;
