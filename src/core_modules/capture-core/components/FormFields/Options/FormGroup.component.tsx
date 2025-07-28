import React from 'react';
import { withStyles } from '@material-ui/core';

const styles: Readonly<any> = {
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        width: 'fit-content',
    },
    formGroupRow: {
        display: 'flex',
        flexDirection: 'row',
        width: 'fit-content',
    },
};

type Props = {
    row?: boolean;
    classes: any;
    children: any;
}

const FormGroupPlain = ({ children, classes, row = false, ...props }: Props) => (
    <div {...props} className={row ? classes.formGroupRow : classes.formGroup} >
        {children}
    </div>
)
;

export const FormGroup = withStyles(styles)(FormGroupPlain);
