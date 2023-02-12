// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { CategorySelector } from '../../../ScopeSelector/QuickSelector/Program/CategorySelector.component';
import type { ProgramCategory, CategoryOption } from './CategoryOptions.types';

const getStyles = (theme: Theme) => ({
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
    requiredClass: {
        color: theme.palette.required,
    },
});

type Props = {
    orientation: string,
    categories: Array<Object>,
    selectedOrgUnitId: string,
    selectedCategories: ProgramCategory,
    onClickCategoryOption: (option: Object, categoryId: string, isValid: boolean) => void,
    onResetCategoryOption: (categoryId: string) => void,
    required?: boolean,
    ...CssClasses
};

const CategoryOptionsPlain = (props: Props) => {
    const { classes,
        orientation = 'horizontal',
        categories,
        selectedOrgUnitId,
        selectedCategories: initalSelectedCategories,
        onClickCategoryOption,
        onResetCategoryOption,
        required,
    } = props;
    const [selectedCategories, setSelectedCategories] = React.useState(initalSelectedCategories);

    const renderSelectedCategory = category => (
        <div className={orientation === 'horizontal' ? classes.container : classes.containerVertical}>
            <div className={orientation === 'horizontal' && classes.label}>
                {category.displayName}
                {required && <span
                    className={classes.requiredClass}
                >
                    &nbsp;*
                </span>}
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

    const renderCategorySelector = category => (
        <div className={orientation === 'horizontal' ? classes.container : classes.containerVertical}>
            <div className={orientation === 'horizontal' && classes.label}>
                {category.displayName}
                {required && <span
                    className={classes.requiredClass}
                >
                    &nbsp;*
                </span>}
            </div>
            <div className={orientation === 'horizontal' && classes.field}>
                <CategorySelector
                    category={category}
                    selectedOrgUnitId={selectedOrgUnitId}
                    onSelect={(option) => {
                        const newCategories = {
                            ...selectedCategories,
                            ...{ [category.id]: option },
                        };
                        setSelectedCategories(newCategories);
                        const isValid = categories.every(({ id }) => newCategories[id]);
                        onClickCategoryOption(option, category.id, isValid);
                    }}
                />
            </div>
        </div>);

    return (
        categories ? <div>
            { categories.map((category) => {
                if (selectedCategories && selectedCategories[category.id]) {
                    return renderSelectedCategory(category);
                }
                return renderCategorySelector(category);
            })}
        </div> : null
    );
};

export const CategoryOptions = withStyles(getStyles)(CategoryOptionsPlain);
