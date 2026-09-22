import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    Button,
    ButtonStrip,
    IconArrowLeft16,
    Checkbox,
    CssVariables,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui';
import { useNavigate } from '../../../utils/routing';
import { WorkingListsSettings, type SaveControls } from './WorkingListsSettings.component';
import styles from './SettingsPage.module.css';

type Section = {
    key: string,
    label: string,
    hint?: string,
    // Only Working lists is wired up; the rest are demo placeholders.
    ready?: boolean,
};

// Each section maps to a key in the `capture` DataStore namespace (see the
// admin-config ticket). Only Working lists is implemented so far.
const SECTIONS: Array<Section> = [
    {
        key: 'workingLists',
        label: i18n.t('Working lists'),
        ready: true,
    },
    {
        key: 'bulkDataEntry',
        label: i18n.t('Bulk data entry'),
        hint: i18n.t('Configure the bulk entry widgets available per program.'),
    },
    {
        key: 'dataEntryForms',
        label: i18n.t('Data entry forms'),
        hint: i18n.t('Customize form layouts and field plugins per context.'),
    },
    {
        key: 'enrollmentLayout',
        label: i18n.t('Enrollment layout'),
        hint: i18n.t('Arrange the widgets shown on the enrollment overview and event pages.'),
    },
    {
        key: 'ruleEngine',
        label: i18n.t('Program rules'),
        hint: i18n.t('Select the program-rule engine implementation.'),
    },
];

const WIREFRAME_BLOCKS = Array.from({ length: 18 }, (_, index) => index);

const IDLE_SAVE: SaveControls = {
    isDirty: false,
    isSaving: false,
    onSave: async () => undefined,
    onDiscard: () => undefined,
};

export const SettingsPage = () => {
    const { navigate } = useNavigate();
    const [activeKey, setActiveKey] = useState<string>('workingLists');
    const [pendingKey, setPendingKey] = useState<string | null>(null);
    const [pendingExit, setPendingExit] = useState(false);
    const [showPlaceholders, setShowPlaceholders] = useState(true);
    const [saveControls, setSaveControls] = useState<SaveControls>(IDLE_SAVE);

    const visibleSections = showPlaceholders ? SECTIONS : SECTIONS.filter(section => section.ready);

    const activeSection = SECTIONS.find(section => section.key === activeKey) ?? SECTIONS[0];
    const pendingSection = SECTIONS.find(section => section.key === pendingKey);

    const requestSection = (key: string) => {
        if (key === activeKey) {
            return;
        }
        if (saveControls.isDirty) {
            setPendingExit(false);
            setPendingKey(key);
            return;
        }
        setActiveKey(key);
    };

    const requestExit = () => {
        if (saveControls.isDirty) {
            setPendingKey(null);
            setPendingExit(true);
            return;
        }
        navigate('/');
    };

    const stayOnSection = () => {
        setPendingKey(null);
        setPendingExit(false);
    };

    const leaveSection = () => {
        saveControls.onDiscard();
        if (pendingExit) {
            setPendingExit(false);
            navigate('/');
            return;
        }
        if (pendingKey) {
            setActiveKey(pendingKey);
        }
        setPendingKey(null);
    };

    return (
        <div>
            {/* Injects the DHIS2 --colors-* / --spacers-* vars at :root; the
                Settings CSS modules reference them. capture-app doesn't provide
                them globally the way the app-platform shell does. */}
            <CssVariables colors spacers />
            <div className={styles.contextBar}>
                <Button
                    small
                    secondary
                    icon={<IconArrowLeft16 />}
                    dataTest="settings-exit-button"
                    onClick={requestExit}
                >
                    {i18n.t('Exit configure mode')}
                </Button>
            </div>

            <div className={styles.layout}>
                <nav className={styles.nav}>
                    {visibleSections.map((section) => {
                        const isActive = section.key === activeKey;
                        return (
                            <button
                                key={section.key}
                                type="button"
                                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                                onClick={() => requestSection(section.key)}
                            >
                                {section.label}
                            </button>
                        );
                    })}
                </nav>

                <div className={styles.main}>
                    <section className={styles.content}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.sectionTitle}>{activeSection.label}</h2>
                            <div className={styles.cardHeaderActions}>
                                {saveControls.isDirty && (
                                    <Button
                                        small
                                        secondary
                                        dataTest="settings-discard-button"
                                        disabled={saveControls.isSaving}
                                        onClick={saveControls.onDiscard}
                                    >
                                        {i18n.t('Discard changes')}
                                    </Button>
                                )}
                                <Button
                                    small
                                    primary
                                    dataTest="settings-save-button"
                                    disabled={!saveControls.isDirty || saveControls.isSaving}
                                    loading={saveControls.isSaving}
                                    onClick={saveControls.onSave}
                                >
                                    {saveControls.isSaving ? i18n.t('Saving...') : i18n.t('Save changes')}
                                </Button>
                            </div>
                        </div>
                        <div className={styles.cardBody}>
                            {activeSection.ready ? (
                                <WorkingListsSettings
                                    showPlaceholders={showPlaceholders}
                                    onSaveControlsChange={setSaveControls}
                                />
                            ) : (
                                <>
                                    <p className={styles.sectionHint}>{activeSection.hint}</p>
                                    <div className={styles.placeholder}>
                                        {i18n.t('{{section}} configuration is not built yet — this is a placeholder.', {
                                            section: activeSection.label,
                                            interpolation: { escapeValue: false },
                                        })}
                                    </div>
                                </>
                            )}
                            {showPlaceholders && (
                                <div className={styles.wireframe} aria-hidden="true">
                                    {WIREFRAME_BLOCKS.map(index => (
                                        <div key={index} className={styles.wireframeBlock}>
                                            placeholder
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
            {(pendingSection || pendingExit) && (
                <Modal small onClose={stayOnSection} dataTest="settings-unsaved-modal">
                    <ModalTitle>{i18n.t('Discard unsaved changes?')}</ModalTitle>
                    <ModalContent>
                        <p className={styles.modalText}>
                            {i18n.t('Your changes to {{section}} will be lost.', {
                                section: activeSection.label,
                            })}
                        </p>
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button secondary onClick={stayOnSection}>
                                {i18n.t('Keep editing')}
                            </Button>
                            <Button destructive onClick={leaveSection}>
                                {i18n.t('Discard changes')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
            <div className={styles.placeholderToggle}>
                <Checkbox
                    dense
                    label={i18n.t('Show placeholder content')}
                    checked={showPlaceholders}
                    onChange={({ checked }: { checked: boolean }) => {
                        setShowPlaceholders(checked);
                        if (!checked && !activeSection.ready) {
                            setActiveKey('workingLists');
                        }
                    }}
                />
            </div>
        </div>
    );
};
