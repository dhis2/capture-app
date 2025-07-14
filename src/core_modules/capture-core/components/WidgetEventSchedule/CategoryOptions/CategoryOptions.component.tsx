import * as React from 'react';
import { withStyles, type WithStyles, type Theme } from '@material-ui/core/styles';
import { spacers } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { CategorySelector } from './CategorySelector.component';
import type { CategoryOption } from './CategoryOptions.types';

const getStyles: any = (theme: Theme) => ({
    container: {
        display: 'flex',
        padding: `${spacers.dp8}  ${spacers.dp16}`,
    },
    error: {
        backgroundColor: theme.palette.error.light,
    },
    containerVertical: {
        display: 'flex',
        flexDirection: 'column',
        margin: 8,
    },
    label: {
        flexBasis: 200,
        paddingLeft: 5,
        paddingTop: 11,
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
        color: (theme.palette as any).required,
    },
    errorMessage: {
        color: theme.palette.error.main,
        fontSize: theme.typography.pxToRem(14),
        padding: '10px 8px',
    },
});

type Props = {
    orientation: string;
    categories: Array<CategoryOption>;
    selectedOrgUnitId: string;
    categoryOptionsError?: {[categoryId: string]: { touched: boolean; valid: boolean} } | null;
    selectedCategories: {[categoryId: string]: string } | null;
    onClickCategoryOption: (optionId: string, categoryId: string) => void;
    onResetCategoryOption: (categoryId: string) => void;
    required?: boolean;
} & WithStyles<typeof getStyles>;

const CategoryOptionsPlain = (props: Props) => {
    const { classes,
        orientation = 'horizontal',
        categories,
        selectedOrgUnitId,
        selectedCategories,
        categoryOptionsError,
        onClickCategoryOption,
        onResetCategoryOption,
        required,
    } = props;

    const renderCategorySelector = (category: CategoryOption) => {
        const { id } = category;
        const hasError = categoryOptionsError?.[id]?.touched && !categoryOptionsError?.[id]?.valid;
        return (<div className={hasError ? classes.error : ''}>
            <div className={orientation === 'horizontal' ? classes.container : classes.containerVertical}>
                <div className={orientation === 'horizontal' ? classes.label : ''}>
                    {category.displayName}
                    {required && <span
                        className={classes.requiredClass}
                    >
                    &nbsp;*
                    </span>}
                </div>
                <div className={orientation === 'horizontal' ? classes.field : ''}>
                    <CategorySelector
                        initialValue={selectedCategories?.[category.id]}
                        category={category}
                        selectedOrgUnitId={selectedOrgUnitId}
                        onChange={(option) => {
                            if (!option) {
                                onResetCategoryOption(category.id);
                            } else {
                                onClickCategoryOption(option.value, category.id);
                            }
                        }}
                    />
                    {hasError && <div className={classes.errorMessage}>{
                        i18n.t('Please select {{categoryName}}',
                            { categoryName: category.displayName })}</div>
                    }
                </div>
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
