import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { MenuItem, IconClockHistory16 } from '@dhis2/ui';
import { ConditionalTooltip } from '../../Tooltips/ConditionalTooltip';

type Props = {
    onOpenChangelog: () => void;
    onClose: () => void;
    disabledMessage?: string;
};

export const ChangelogMenuItem = ({ onOpenChangelog, onClose, disabledMessage }: Props) => {
    const disabled = !!disabledMessage;
    return (
        <ConditionalTooltip content={disabledMessage ?? ''} enabled={disabled}>
            <MenuItem
                dense
                disabled={disabled}
                icon={<IconClockHistory16 />}
                label={i18n.t('View changelog')}
                suffix={null}
                dataTest="event-overflow-changelog"
                onClick={() => {
                    onOpenChangelog();
                    onClose();
                }}
            />
        </ConditionalTooltip>
    );
};
