// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import type { CategoryOption } from './CategoryOptions.types';

const getStyles = () => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 8,
    },
    label: {
        flexBasis: 200,
        paddingLeft: 5,
    },
    field: {
        fontWeight: 500,
    },
});

type Props = {
    categories: Array<CategoryOption>,
    selectedCategories?: ?{[categoryId: string]: CategoryOption },
    ...CssClasses
};

const CategoryOptionsViewModePlain = (props: Props) => {
    const { classes, categories, selectedCategories } = props;

    return (
        categories ? <div>
            { categories.map(category => (
                <div className={classes.container}>
                    <div className={classes.label}>
                        {category.displayName}
                    </div>
                    <div className={classes.field}>
                        {selectedCategories?.[category.id]?.displayName}
                    </div>
                </div>
            ))}
        </div> : null
    );
};

export const CategoryOptionsViewMode = withStyles(getStyles)(CategoryOptionsViewModePlain);
