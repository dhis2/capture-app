// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
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
});

type Props = {
    classes: Object,
    orientation: string
};

const CatComboPlain = (props: Props) => {
    const { classes, orientation, categories, selectedOrgUnitId, onClickCategoryOption } = props;
    return (
        categories ? <div>
            { categories.map(category => (
                <div className={orientation === 'horizontal' ? classes.container : classes.containerVertical}>
                    <div className={orientation === 'horizontal' && classes.label}>
                        {category.displayName}
                    </div>
                    <div className={orientation === 'horizontal' && classes.field}>
                        <CategorySelector
                            category={category}
                            selectedOrgUnitId={selectedOrgUnitId}
                            onSelect={(option) => { onClickCategoryOption(option, category.id); }}
                        />
                    </div>
                </div>
            ))}
        </div> : null
    );
};

export const CatCombo = withStyles(getStyles)(CatComboPlain);
