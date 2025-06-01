import React, { useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalActions, ModalContent, ModalTitle, Button, ButtonStrip } from '@dhis2/ui';
import type { NoticeBoxProps, HiddenFieldEffect, ContentListItem } from './NoticeBox.types';

const buildContentListToDisplay = (rulesEffectsHiddenFields: Record<string, HiddenFieldEffect>): ContentListItem[] =>
    Object.keys(rulesEffectsHiddenFields).reduce((acc, key) => {
        if (rulesEffectsHiddenFields[key].hadValue) {
            const text =
                rulesEffectsHiddenFields[key].content ||
                `${rulesEffectsHiddenFields[key].name} ${i18n.t('was blanked out and hidden by your last action')}`;
            return [...acc, { key, text }];
        }
        return acc;
    }, [] as ContentListItem[]);

export const NoticeBox = ({ formId }: NoticeBoxProps) => {
    const [toggle, setToggle] = useState(false);
    const [contentList, setContentList] = useState<ContentListItem[]>([]);

    const { rulesEffectsHiddenFields } = useSelector(
        (state: { rulesEffectsHiddenFields: Record<string, Record<string, HiddenFieldEffect>> }) => ({
            rulesEffectsHiddenFields: state.rulesEffectsHiddenFields[formId] || {},
        }),
        shallowEqual,
    );

    useEffect(() => {
        const contentListToDisplay = buildContentListToDisplay(rulesEffectsHiddenFields);
        if (contentListToDisplay?.length > 0) {
            setContentList(contentListToDisplay);
            setToggle(true);
        }
    }, [rulesEffectsHiddenFields]);

    return toggle ? (
        <Modal onClose={() => setToggle(false)} position="middle">
            <ModalTitle>{i18n.t('Notice') as string}</ModalTitle>
            <ModalContent>
                <ul>
                    {contentList.map(content => (
                        <li key={content.key}>{content.text}</li>
                    ))}
                </ul>
                <ModalActions>
                    <ButtonStrip end>
                        <Button onClick={() => setToggle(false)}>{i18n.t('Close the notice') as string}</Button>
                    </ButtonStrip>
                </ModalActions>
            </ModalContent>
        </Modal>
    ) : null;
};
