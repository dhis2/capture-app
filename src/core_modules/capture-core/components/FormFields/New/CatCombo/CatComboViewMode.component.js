// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

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
    classes: Object,
    orientation: string
};

const CatComboViewModePlain = (props: Props) => {
    const { classes, orientation, categories, categoryCombo } = props;
    return (
        categories ? <div>
            { categories.map(category => (
                <div className={classes.container}>
                    <div className={classes.label}>
                        {category.displayName}
                    </div>
                    <div className={classes.field}>
                        {categoryCombo?.[category.id]?.[0].displayName}
                    </div>
                </div>
            ))}
        </div> : null
    );
};

export const CatComboViewMode = withStyles(getStyles)(CatComboViewModePlain);
