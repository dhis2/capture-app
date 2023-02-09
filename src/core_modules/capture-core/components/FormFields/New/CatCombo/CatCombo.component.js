// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { CategorySelector } from '../../../ScopeSelector/QuickSelector/Program/CategorySelector.component';

const getStyles = () => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 8,
    },
    containerVertical: {
        display: 'flex',
        flexDirection: 'column',
        margin: 8,
    },
    label: {
        flexBasis: 200,
        paddingLeft: 5,
    },
    field: {
        flexBasis: 150,
        flexGrow: 1,
    },
    selectedText: {
        display: 'flex',
        alignItems: 'center',
    },
});

type Props = {
    classes: Object,
    orientation: string
};

const CatComboPlain = (props: Props) => {
    const { classes,
        orientation = 'horizontal',
        categories,
        selectedOrgUnitId,
        selectedCategories: initalSelectedCategories,
        onClickCategoryOption,
        onResetCategoryOption,
    } = props;
    const [selectedCategories, setSelectedCategories] = React.useState(initalSelectedCategories);

    return (
        categories ? <div>
            {/* eslint-disable-next-line complexity */}
            { categories.map((category) => {
                if (selectedCategories && selectedCategories[category.id]) {
                    return (
                        <div className={orientation === 'horizontal' ? classes.container : classes.containerVertical}>
                            <div className={orientation === 'horizontal' && classes.label}>
                                {category.displayName}
                            </div>
                            <div className={orientation === 'horizontal' && classes.field}>
                                <div className={classes.selectedText}>
                                    <div className={classes.selectedCategoryNameContainer}>
                                        {selectedCategories[category.id]?.name}</div>
                                    <IconButton
                                        data-test="reset-category"
                                        className={classes.selectedButton}
                                        onClick={() => {
                                            const newCategories = { ...selectedCategories };
                                            delete newCategories[category.id];
                                            setSelectedCategories(newCategories);
                                            onResetCategoryOption(category.id);
                                        }}
                                    >
                                        <ClearIcon className={classes.selectedButtonIcon} />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    );
                }
                return (
                    <div className={orientation === 'horizontal' ? classes.container : classes.containerVertical}>
                        <div className={orientation === 'horizontal' && classes.label}>
                            {category.displayName}
                        </div>
                        <div className={orientation === 'horizontal' && classes.field}>
                            <CategorySelector
                                category={category}
                                selectedOrgUnitId={selectedOrgUnitId}
                                onSelect={(option) => {
                                    setSelectedCategories({
                                        ...selectedCategories,
                                        ...{ [category.id]: option },
                                    });
                                    onClickCategoryOption(option, category.id);
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div> : null
    );
};

export const CatCombo = withStyles(getStyles)(CatComboPlain);
