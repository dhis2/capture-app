// @flow
import React, { useState, useEffect } from 'react';
import { isEqual } from 'lodash';
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalActions, ModalContent, ModalTitle, Button, ButtonStrip } from '@dhis2/ui';

const isFormTouched = (formsSectionsFieldsUI, formId) =>
    formsSectionsFieldsUI &&
    Object.entries(formsSectionsFieldsUI).some(
        // $FlowFixMe https://github.com/facebook/flow/issues/2221
        ([key, fields]) => key.startsWith(formId) && Object.values(fields).some(field => field.touched),
    );

const buildContentListToDisplay = rulesEffectsHiddenFields =>
    Object.keys(rulesEffectsHiddenFields).reduce((acc, key) => {
        if (rulesEffectsHiddenFields[key].hadValue) {
            const text =
                rulesEffectsHiddenFields[key].content ||
                `${rulesEffectsHiddenFields[key].name} ${i18n.t('was blanked out and hidden by your last action')}`;
            return [...acc, { key, text }];
        }
        return acc;
    }, []);

export const NoticeBox = ({ formId }: { formId: string }) => {
    const [toggle, setToggle] = useState(false);
    const [contentList, setContentList] = useState([]);
    const [previousRulesEffectsHiddenFields, setPreviousRulesEffectsHiddenFields] = useState();

    const { rulesEffectsHiddenFields, formTouched } = useSelector(
        state => ({
            rulesEffectsHiddenFields: state.rulesEffectsHiddenFields[formId] || [],
            formTouched: isFormTouched(state.formsSectionsFieldsUI, formId),
        }),
        shallowEqual,
    );

    useEffect(() => {
        if (formTouched && !isEqual(previousRulesEffectsHiddenFields, rulesEffectsHiddenFields)) {
            const contentListToDisplay = buildContentListToDisplay(rulesEffectsHiddenFields);
            if (contentListToDisplay?.length > 0) {
                setContentList(contentListToDisplay);
                setToggle(true);
            }
            setPreviousRulesEffectsHiddenFields(rulesEffectsHiddenFields);
        }
    }, [rulesEffectsHiddenFields, previousRulesEffectsHiddenFields, formTouched]);

    return toggle ? (
        <Modal onClose={() => setToggle(false)} position="middle">
            <ModalTitle>{i18n.t('Notice')}</ModalTitle>
            <ModalContent>
                <ul>
                    {contentList.map(content => (
                        <li key={content.key}>{content.text}</li>
                    ))}
                </ul>
                <ModalActions>
                    <ButtonStrip end>
                        <Button onClick={() => setToggle(false)}>{i18n.t('Close the notice')}</Button>
                    </ButtonStrip>
                </ModalActions>
            </ModalContent>
        </Modal>
    ) : null;
};
