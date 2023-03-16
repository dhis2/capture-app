// @flow
import React, { useState, useEffect } from 'react';
import { isEqual } from 'lodash';
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalActions, ModalContent, ModalTitle, Button, ButtonStrip } from '@dhis2/ui';

const buildContentListToDisplay = (rulesEffectsHiddenFields, previousFormsValues, formsValues) =>
    Object.keys(rulesEffectsHiddenFields).reduce((acc, key) => {
        const fieldWasHidden =
            previousFormsValues && previousFormsValues[key] && formsValues && formsValues[key] === null;
        if (fieldWasHidden) {
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
    const [previousFormsValues, setPreviousFormsValues] = useState();
    const [previousRulesEffectsHiddenFields, setPreviousRulesEffectsHiddenFields] = useState();

    const { rulesEffectsHiddenFields, formsValues } = useSelector(
        state => ({
            rulesEffectsHiddenFields: state.rulesEffectsHiddenFields[formId] || [],
            formsValues: state.formsValues[formId] || [],
        }),
        shallowEqual,
    );

    useEffect(() => {
        if (!isEqual(previousFormsValues, formsValues)) {
            if (!isEqual(previousRulesEffectsHiddenFields, rulesEffectsHiddenFields)) {
                const contentListToDisplay = buildContentListToDisplay(
                    rulesEffectsHiddenFields,
                    previousFormsValues,
                    formsValues,
                );
                if (contentListToDisplay?.length > 0) {
                    setContentList(contentListToDisplay);
                    setToggle(true);
                }
                setPreviousRulesEffectsHiddenFields(rulesEffectsHiddenFields);
            }
            setPreviousFormsValues(formsValues);
        }
    }, [rulesEffectsHiddenFields, formsValues, previousFormsValues, previousRulesEffectsHiddenFields]);

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
