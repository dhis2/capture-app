import * as React from 'react';
import { MenuDivider, MenuItem, Button, colors, spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import { FiltrableMenuItems } from '../FiltrableMenuItems';
import type { Program, Icon } from '../../../../metaData';
import { OptionLabel } from '../../OptionLabel';

const styles = () => ({
    filterWarning: {
        fontSize: '14px',
        color: `${colors.grey700}`,
        display: 'flex',
        alignItems: 'center',
        gap: `${spacers.dp8}`,
        padding: `${spacers.dp4} ${spacers.dp12}`,
    },
});

type OwnProps = {
    programOptions: Array<{
        value: string;
        label: string;
        icon?: Icon;
    }>;
    programsArray: Array<Program>;
    onChange: (option: { value?: string }) => void;
    onResetOrgUnit: () => void;
};

type Props = OwnProps & WithStyles<typeof styles>;

const ProgramListPlain = ({ programOptions, programsArray, onChange, onResetOrgUnit, classes }: Props) => {
    const areAllProgramsAvailable =
        programOptions.length === programsArray.filter(program => program.access.data.read).length;

    return (
        <>
            {programOptions.length > 10 ? (
                <FiltrableMenuItems
                    options={programOptions}
                    onChange={onChange}
                    searchText={i18n.t('Search for a program')}
                    dataTest="program"
                />
            ) : (
                programOptions.map(option => (
                    <MenuItem
                        key={option.value}
                        label={<OptionLabel icon={option.icon} label={option.label} />}
                        value={option.value}
                        suffix=""
                        onClick={onChange}
                    />
                ))
            )}

            {!areAllProgramsAvailable && (
                <>
                    <MenuDivider />
                    <div className={classes.filterWarning}>
                        <span>{i18n.t('Some programs are being filtered by the chosen organisation unit')}</span>
                        <Button small secondary onClick={() => onResetOrgUnit()}>
                            {i18n.t('Show all programs')}
                        </Button>
                    </div>
                </>
            )}
        </>
    );
};

export const ProgramList = withStyles(styles)(ProgramListPlain);
