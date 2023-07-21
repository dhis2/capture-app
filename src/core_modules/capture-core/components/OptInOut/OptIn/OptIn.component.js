// @flow
import React, { useState, type ComponentType } from 'react';
import { NoticeBox, Button, Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import type { PlainProps } from './optIn.types';

const styles = {
    container: {
        width: '80%',
        margin: '0 auto',
    },
};

export const OptInPlain = ({ classes, programName, handleOptIn, loading }: PlainProps) => {
    const [toggle, setToggle] = useState(false);

    const title = i18n.t('Use new Enrollment dashboard for {{programName}}', {
        programName,
        interpolation: { escapeValue: false },
    });
    const button = i18n.t('Opt in for {{programName}}', {
        programName,
        interpolation: { escapeValue: false },
    });

    const modalContent = i18n.t('By clicking opt-in below, you will start using the new enrollment dashboard in the Capture app for this Tracker program. At the moment, there is certain functionality from Tracker Capture that has not yet been added, including relationship and referral functionality. The work on including this Tracker functionality in Capture is ongoing and will be added in upcoming app releases.');

    const modalContentFeedback = i18n.t('The core team appreciates any feedback on this new functionality which is currently being beta tested, please report any issues and feedback in the DHIS2 JIRA project.');

    return (
        <div data-test="opt-in">
            <NoticeBox title={title} className={classes.container}>
                <p>
                    {i18n.t('Click the button below to opt-in to the new enrollment dashboard functionality in the Capture app (beta) for this Tracker program for all users.')}
                </p>
                <Button onClick={() => setToggle(true)}>
                    {button}
                </Button>
            </NoticeBox>
            <br />
            {toggle && (
                <Modal onClose={() => setToggle(false)} dataTest="opt-in-modal">
                    <ModalTitle>{title}</ModalTitle>
                    <ModalContent>
                        <p>{modalContent} </p>
                        <p>{modalContentFeedback} </p>
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button onClick={() => setToggle(false)} secondary>
                                {i18n.t('No, cancel')}
                            </Button>
                            <Button
                                data-test="opt-in-button"
                                primary
                                loading={loading}
                                disabled={loading}
                                onClick={() => handleOptIn()}
                            >
                                {i18n.t('Yes, opt in')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </div>
    );
};

export const OptIn: ComponentType<$Diff<PlainProps, CssClasses>> = withStyles(styles)(OptInPlain);
