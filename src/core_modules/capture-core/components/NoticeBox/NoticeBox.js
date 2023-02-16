// @flow
import React, { useState, useEffect } from 'react';
import { isEqual } from 'lodash';
// $FlowFixMe
import { useSelector, shallowEqual } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { Modal, ModalActions, ModalContent, ModalTitle, Button, ButtonStrip } from '@dhis2/ui';

const buildContentListToDisplay = (rulesEffectsNotice, previousFormsValues, formsValues) =>
    Object.keys(rulesEffectsNotice).reduce((acc, key) => {
        const fieldWasHidden =
            previousFormsValues && previousFormsValues[key] && formsValues && formsValues[key] === null;
        if (fieldWasHidden) {
            const text =
                rulesEffectsNotice[key].content ||
                `${rulesEffectsNotice[key].name} ${i18n.t('was blanked out and hidden by your last action')}`;
            return [...acc, { key, text }];
        }
        return acc;
    }, []);

export const NoticeBox = ({ formId }: { formId: string }) => {
    const [toggle, setToggle] = useState(false);
    const [contentList, setContentList] = useState([]);
    const [previousFormsValues, setPreviousFormsValues] = useState();
    const [previousRulesEffectsNotice, setPreviousRulesEffectsNotice] = useState();

    const { rulesEffectsNotice, formsValues } = useSelector(
        state => ({
            rulesEffectsNotice: state.rulesEffectsNotice[formId] || [],
            formsValues: state.formsValues[formId] || [],
        }),
        shallowEqual,
    );

    useEffect(() => {
        if (!isEqual(previousFormsValues, formsValues)) {
            if (!isEqual(previousRulesEffectsNotice, rulesEffectsNotice)) {
                const contentListToDisplay = buildContentListToDisplay(
                    rulesEffectsNotice,
                    previousFormsValues,
                    formsValues,
                );
                if (contentListToDisplay?.length > 0) {
                    setContentList(contentListToDisplay);
                    setToggle(true);
                }
                setPreviousRulesEffectsNotice(rulesEffectsNotice);
            }
            setPreviousFormsValues(formsValues);
        }
    }, [rulesEffectsNotice, formsValues, previousFormsValues, previousRulesEffectsNotice]);

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
