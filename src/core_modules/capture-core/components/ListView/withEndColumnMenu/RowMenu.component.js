// @flow
import React, { useState, useRef } from 'react';
import { IconButton } from 'capture-ui';
import { MenuItem, Layer, Popper, IconMore24, FlyoutMenu } from '@dhis2/ui';
import type { Props } from './rowMenu.types';
import { ConditionalTooltip } from '../../Tooltips/ConditionalTooltip';
import i18n from '../../../../../locales';
import { isValidPeriod } from '../../../utils/validation/validators/form';

export const RowMenu = (props: Props) => {
    const { customRowMenuContents = [], row } = props;
    const eventOccurredAt = row.occurredAt;

    const anchorRef = useRef(null);
    const [actionsIsOpen, setActionsIsOpen] = useState(false);

    const toggle = () => {
        setActionsIsOpen(prev => !prev);
    };

    const renderMenuItems = () => customRowMenuContents.map((content) => {
        const { isWithinValidPeriod } = isValidPeriod(eventOccurredAt, content?.expiredPeriod);
        const isDisabled = !content.clickHandler || !isWithinValidPeriod;

        return (
            <ConditionalTooltip
                key={content.key}
                content={i18n.t('{{occurredAt}} belongs to an expired period. Event cannot be edited', {
                    occurredAt: eventOccurredAt,
                    interpolation: { escapeValue: false },
                })}
                enabled={!isWithinValidPeriod}
            >
                <MenuItem
                    key={content.key}
                    data-test={`menu-item-${content.key}`}
                    onClick={() => {
                        if (!content.clickHandler) {
                            return;
                        }
                        setActionsIsOpen(false);
                        // $FlowFixMe common flow, I checked this 4 lines up
                        content.clickHandler(row);
                    }}
                    disabled={isDisabled}
                    label={content.label}
                    icon={content.icon}
                />
            </ConditionalTooltip>
        );
    });

    return (
        <div ref={anchorRef} style={{ display: 'inline-block', position: 'relative' }}>
            <IconButton
                onClick={toggle}
                data-test="row-menu-toggle"
            >
                <IconMore24 />
            </IconButton>
            {actionsIsOpen && (
                <Layer onBackdropClick={() => setActionsIsOpen(false)} transparent>
                    <Popper
                        placement="right"
                        reference={anchorRef}
                        data-test="row-menu-popper"
                    >
                        <FlyoutMenu role="menu">
                            {renderMenuItems()}
                        </FlyoutMenu>
                    </Popper>
                </Layer>
            )}
        </div>
    );
};
