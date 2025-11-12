import * as React from 'react';
import { withStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import type { WithStyles } from 'capture-core-utils/styles';

import { localeCompareStrings } from '../../../utils/localeCompareStrings';
import { TemplateSelectorChip } from './TemplateSelectorChip.component';
import { CaptureScrollHeight } from './CaptureScrollHeight.component';
import { LinkButton } from '../../Buttons/LinkButton.component';
import type { WorkingListTemplates } from './workingListsBase.types';

const getBorder = (theme: any) => {
    const color = theme.palette.dividerLighter;
    return `${theme.typography.pxToRem(1)} solid ${color}`;
};

const maxHeight = 110;

const getStyles = (theme: any) => ({
    container: {
        borderBottom: getBorder(theme),
    },
    configsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: `${theme.typography.pxToRem(3)} 0rem`,
        maxHeight,
        overflow: 'hidden',
    },
    configsContainerExpanded: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: `${theme.typography.pxToRem(3)} 0rem`,
    },
    chipContainer: {
        padding: `${theme.typography.pxToRem(5)} ${theme.typography.pxToRem(8)}`,
    },
    linkButtonContainer: {
        marginBottom: 5,
        display: 'flex',
        justifyContent: 'center',
    },
    linkButton: {
        fontSize: 10,
        backgroundColor: 'transparent',
        '&:focus': {
            outline: 'none',
            fontWeight: 500,
        },
    },
}) as const;

type OwnProps = {
    templates: WorkingListTemplates;
    currentTemplateId: string;
    currentListIsModified: boolean;
    onSelectTemplate: (template: any) => void;
    selectionInProgress: boolean;
};

type Props = OwnProps & WithStyles<typeof getStyles>;

const TemplateSelectorPlain = (props: Props) => {
    const {
        templates,
        currentTemplateId,
        currentListIsModified,
        onSelectTemplate,
        selectionInProgress,
        classes,
    } = props;

    const containerEl = React.useRef<HTMLDivElement | null>(null);
    const [isExpanded, setExpandedStatus] = React.useState(false);

    const customTemplates = React.useMemo(() => templates
        .filter(c => !c.isDefault)
        .sort(({ order: orderA, name: nameA }, { order: orderB, name: nameB }) => {
            let sortResult;
            if (orderA && orderB) {
                sortResult = orderA - orderB;
            } else if (orderA) {
                sortResult = 1;
            } else if (orderB) {
                sortResult = -1;
            } else {
                sortResult = localeCompareStrings(nameA, nameB);
            }
            return sortResult;
        }), [templates]);

    const getHeightModifierButton = React.useCallback(() => (
        <LinkButton
            className={classes.linkButton}
            onClick={() => { setExpandedStatus(!isExpanded); }}
        >
            {isExpanded ? i18n.t('Show Less') : i18n.t('Show All')}
        </LinkButton>
    ), [isExpanded, classes.linkButton]);

    if (customTemplates.length <= 0) {
        return null;
    }

    const configElements = customTemplates.map((customTemplate) => {
        const { id } = customTemplate;
        return (
            <div
                data-test="workinglist-template-selector-chip-container"
                className={classes.chipContainer}
                key={id}
            >
                <TemplateSelectorChip
                    template={customTemplate}
                    currentTemplateId={currentTemplateId}
                    onSelectTemplate={onSelectTemplate}
                    currentListIsModified={currentListIsModified}
                    disabled={selectionInProgress}
                />
            </div>
        );
    });

    return (
        <div
            className={classes.container}
        >
            <CaptureScrollHeight
                captureEl={containerEl}
                extraTriggers={[templates]}
            >
                {height => (
                    <React.Fragment>
                        <div
                            data-test="workinglists-template-selector-chips-container"
                            ref={containerEl}
                            className={!isExpanded ? classes.configsContainer : classes.configsContainerExpanded}
                        >
                            {configElements}
                        </div>
                        <div
                            className={classes.linkButtonContainer}
                        >
                            {height > maxHeight ? getHeightModifierButton() : null}
                        </div>
                    </React.Fragment>
                )}
            </CaptureScrollHeight>
        </div>
    );
};

export const TemplateSelector = withStyles(getStyles)(TemplateSelectorPlain);
