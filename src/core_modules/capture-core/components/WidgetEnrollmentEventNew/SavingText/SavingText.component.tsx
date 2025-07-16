import React from 'react';
import ReactDOM from 'react-dom';
import i18n from '@dhis2/d2-i18n';
import { InfoIconText } from '../../InfoIconText';
import type { Props } from './savingText.types';

export const SavingText = ({ orgUnitName, stageName, programName, placementDomNode }: Props) =>
    (placementDomNode ?
        ReactDOM.createPortal((
            <InfoIconText>
                <span>
                    {orgUnitName
                        ? i18n.t('Saving to {{stageName}} for {{programName}} in {{orgUnitName}}',
                            { orgUnitName, stageName, programName, interpolation: { escapeValue: false } })
                        : i18n.t('Saving to {{stageName}} for {{programName}}',
                            { stageName, programName, interpolation: { escapeValue: false } })}
                </span>
            </InfoIconText>
        ), placementDomNode) : null);
