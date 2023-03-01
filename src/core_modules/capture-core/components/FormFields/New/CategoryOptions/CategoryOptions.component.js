// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { CategorySelector } from './CategorySelector.component';
import type { CategoryOption } from './CategoryOptions.types';

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
    categories: Array<CategoryOption>,
    selectedOrgUnitId: string,
    selectedCategories: ?{[categoryId: string]: CategoryOption },
    onClickCategoryOption: (option: CategoryOption, categoryId: string, isValid: boolean) => void,
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

    const renderCategorySelector = (category) => {
        const initialValue = initalSelectedCategories?.[category.id] ?
            {
                value: initalSelectedCategories[category.id].id,
                label: initalSelectedCategories[category.id].displayName,
            } : undefined;
        return (<div className={orientation === 'horizontal' ? classes.container : classes.containerVertical}>
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
                    initialValue={initialValue}
                    category={category}
                    selectedOrgUnitId={selectedOrgUnitId}
                    onChange={(option) => {
                        if (!option) {
                            const newCategories = { ...selectedCategories };
                            delete newCategories[category.id];
                            setSelectedCategories(newCategories);
                            onResetCategoryOption(category.id);
                        } else {
                            const newOption = { id: option.value, displayName: option.label };
                            const newCategories = {
                                ...selectedCategories,
                                ...{ [category.id]: newOption },
                            };
                            setSelectedCategories(newCategories);
                            const isValid = categories.every(({ id: categoryId }) => newCategories[categoryId]);
                            onClickCategoryOption(newOption, category.id, isValid);
                        }
                    }}
                />
            </div>
        </div>);
    };

    return (
        categories ? <div>
            {categories.map(renderCategorySelector)}
        </div> : null
    );
};

export const CategoryOptions = withStyles(getStyles)(CategoryOptionsPlain);
