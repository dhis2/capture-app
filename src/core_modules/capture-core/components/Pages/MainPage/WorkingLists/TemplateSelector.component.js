// @flow
import * as React from 'react';
import { fade, lighten } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import TemplateSelectorChip from './TemplateSelectorChip.component';
import CaptureScrollHeight from './CaptureScrollHeight.component';
import LinkButton from '../../../Buttons/LinkButton.component';
import type { WorkingListTemplate } from './workingLists.types';

const getBorder = (theme: Theme) => {
    const color = lighten(fade(theme.palette.divider, 1), 0.88);
    return `${theme.typography.pxToRem(1)} solid ${color}`;
};

const maxHeight = 110;

const getStyles = (theme: Theme) => ({
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
});

type Props = {
    templates: Array<WorkingListTemplate>,
    currentTemplateId: string,
    currentListIsModified: boolean,
    onSelectTemplate: Function,
    classes: Object,
};

const TemplateSelector = (props: Props) => {
    const {
        templates,
        currentTemplateId,
        currentListIsModified,
        onSelectTemplate,
        classes,
    } = props;

    const containerEl = React.useRef(null);
    const [isExpanded, setExpandedStatus] = React.useState(false);

    const customTemplates = React.useMemo(() => templates
        .filter(c => !c.isDefault)
        .sort((a, b) => a.name.localeCompare(b.name)), [
        templates,
    ]);

    const getHeightModifierButton = React.useCallback(() => {
        return (
            <LinkButton
                className={classes.linkButton}
                onClick={() => { setExpandedStatus(!isExpanded); }}>
                {isExpanded ? i18n.t('Show Less') : i18n.t('Show All')}
            </LinkButton>
        );
    }, [isExpanded, classes.linkButton]);

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

export default withStyles(getStyles)(TemplateSelector);
