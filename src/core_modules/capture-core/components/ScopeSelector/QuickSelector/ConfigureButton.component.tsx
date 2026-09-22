import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, IconSettings16, colors } from '@dhis2/ui';
import { useNavigate } from '../../../utils/routing';

const styles: Readonly<any> = {
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        height: '40px',
        paddingInlineEnd: 8,
    },
    button: {
        color: colors.grey700,
    },
};

// Subtle, right-aligned entry point into the admin configuration area.
export const ConfigureButton = () => {
    const { navigate } = useNavigate();

    return (
        <div style={styles.wrapper}>
            <Button
                small
                secondary
                icon={<IconSettings16 />}
                dataTest="configure-button"
                onClick={() => navigate('/settings')}
            >
                <span style={styles.button}>{i18n.t('Configure')}</span>
            </Button>
        </div>
    );
};
