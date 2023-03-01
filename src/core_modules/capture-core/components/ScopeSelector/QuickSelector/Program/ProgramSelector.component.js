// @flow

import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { SelectorBarItem, Menu, MenuItem, MenuDivider, spacers } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { programCollection } from '../../../../metaDataMemoryStores';
import type { Program } from '../../../../metaData';
import { resetProgramIdBase } from '../actions/QuickSelector.actions';
import { EmptyPrograms } from './EmptyPrograms';
import { ProgramList } from './ProgramList';
import { getOptions } from './getOptions';
import { CategorySelector } from '../../../CategorySelector';

const styles = () => ({
    selectBarMenu: {
        maxHeight: '80vh',
        overflow: 'auto',
        paddingBottom: `${spacers.dp4}`,
    },
});

type Props = {
    handleClickProgram?: (value: string) => void,
    handleSetCatergoryCombo?: (category: Object, categoryId: string) => void,
    onResetProgramId: (baseAction: ReduxAction<any, any>) => void,
    onResetCategoryOption: (categoryId: string) => void,
    onResetOrgUnit: () => void,
    selectedProgramId?: string,
    selectedOrgUnitId?: string,
    selectedCategories: Object,
    classes: Object,
};

const ProgramSelectorPlain = ({
    handleClickProgram,
    handleSetCatergoryCombo,
    onResetProgramId,
    onResetCategoryOption,
    onResetOrgUnit,
    selectedProgramId,
    selectedOrgUnitId,
    selectedCategories,
    classes,
}: Props) => {
    const [open, setOpen] = useState(false);
    const [programsArray, setProgramsArray] = useState<Array<Program>>([]);
    const selectedProgram = selectedProgramId ? programCollection.get(selectedProgramId) : null;
    const programOptions = getOptions(selectedOrgUnitId, programsArray);

    useEffect(() => {
        setProgramsArray(Array.from(programCollection.values()));
    }, []);

    const renderCategories = () => {
        if (selectedProgram?.categoryCombination) {
            return Array.from(selectedProgram.categoryCombination.categories.values()).map(category => (
                <CategorySelector
                    category={{ id: category.id, name: category.name }}
                    selectedCategoryName={
                        selectedCategories && selectedCategories[category.id]
                            ? selectedCategories[category.id].name
                            : ''
                    }
                    onSelect={option => handleSetCatergoryCombo && handleSetCatergoryCombo(option, category.id)}
                    onClearSelectionClick={() => onResetCategoryOption(category.id)}
                    selectedOrgUnitId={selectedOrgUnitId}
                />
            ));
        }
        return null;
    };

    return (
        <>
            <SelectorBarItem
                label={i18n.t('Program')}
                noValueMessage={i18n.t('Choose a program')}
                value={selectedProgram?.name}
                open={open}
                setOpen={openSelectorBarItem => setOpen(openSelectorBarItem)}
                onClearSelectionClick={() => onResetProgramId(resetProgramIdBase())}
                dataTest="program-selector-container"
            >
                <div className={classes.selectBarMenu}>
                    <Menu>
                        {programOptions.length === 0 ? (
                            <EmptyPrograms onResetOrgUnit={() => onResetOrgUnit()} />
                        ) : (
                            <>
                                <ProgramList
                                    programOptions={programOptions}
                                    programsArray={programsArray}
                                    onChange={(item) => {
                                        setOpen(false);
                                        handleClickProgram && handleClickProgram(item.value);
                                    }}
                                    onResetOrgUnit={() => onResetOrgUnit()}
                                />
                                {Boolean(selectedProgram) && programOptions.length > 10 && (
                                    <>
                                        <MenuDivider />
                                        <MenuItem
                                            dense
                                            onClick={() => {
                                                setOpen(false);
                                                onResetProgramId(resetProgramIdBase());
                                            }}
                                            label={i18n.t('Clear selection')}
                                        />
                                    </>
                                )}
                            </>
                        )}
                    </Menu>
                </div>
            </SelectorBarItem>
            {renderCategories()}
        </>
    );
};
export const ProgramSelector = withStyles(styles)(ProgramSelectorPlain);
