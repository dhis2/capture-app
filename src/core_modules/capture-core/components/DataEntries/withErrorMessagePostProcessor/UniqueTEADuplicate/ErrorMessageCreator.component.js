// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import type { ErrorData } from '../../../D2Form/FormBuilder';
import { LinkButton } from '../../../Buttons/LinkButton.component';

const getStyles = () => ({
    linkButton: {
        fontSize: 'inherit',
        paddingLeft: 0,
        paddingRight: 3,
        backgroundColor: 'inherit',
        textDecoration: 'underline',
        cursor: 'pointer',
        outline: 'none',
    },
    container: {
        padding: 2,
    },
});

type Props = {
    errorData: ErrorData,
    trackedEntityTypeName: string,
    attributeName: string,
    classes: Object,
    onShowExisting: () => void,
};

class UniqueTEADuplicateErrorMessageCreatorPlain extends React.Component<Props> {
    static renderPrerequisitesError() {
        return (
            <div>
                {i18n.t('A duplicate exists (but there were some errors, see log for details')}
            </div>
        );
    }

    static renderNoAccess(attributeName: string) {
        const attributeNameLC = attributeName.toLowerCase();
        return (
            <div>
                {i18n.t(
                    'An item with this {{attributeName}} is already registered, but you don\'t have access to it',
                    { attributeName: attributeNameLC, interpolation: { escapeValue: false } },
                )}
            </div>
        );
    }

    static renderAttributeValueExistsUnsaved(attributeName: string) {
        const attributeNameLC = attributeName.toLowerCase();
        return (
            <div>
                {i18n.t(
                    'You have already registered this {{attributeName}}',
                    { attributeName: attributeNameLC, interpolation: { escapeValue: false } },
                )}
            </div>
        );
    }

    handleShowExisting = () => {
        this.props.onShowExisting();
    }

    renderDefault(attributeName: string, trackedEntityTypeName: string, linkButtonClass: string) {
        const trackedEntityTypeNameLC = trackedEntityTypeName.toLowerCase();
        const attributeNameLC = attributeName.toLowerCase();
        return (
            <React.Fragment>
                <div>
                    {i18n.t(
                        'A {{trackedEntityTypeName}} with this {{attributeName}} is already registered',
                        { trackedEntityTypeName: trackedEntityTypeNameLC, attributeName: attributeNameLC, interpolation: { escapeValue: false } },
                    )}
                </div>
                <div>
                    <LinkButton
                        onClick={this.handleShowExisting}
                        className={linkButtonClass}
                    >
                        {i18n.t(
                            'Show registered {{trackedEntityTypeName}}',
                            { trackedEntityTypeName: trackedEntityTypeNameLC, interpolation: { escapeValue: false } },
                        )}
                    </LinkButton>
                </div>
            </React.Fragment>
        );
    }

    renderContents() {
        const { trackedEntityTypeName, attributeName, errorData, classes } = this.props;

        if (!trackedEntityTypeName || !attributeName) {
            return UniqueTEADuplicateErrorMessageCreator.renderPrerequisitesError();
        }

        if (!errorData) {
            return UniqueTEADuplicateErrorMessageCreator.renderNoAccess(attributeName);
        }

        if (errorData.attributeValueExistsUnsaved) {
            return UniqueTEADuplicateErrorMessageCreator.renderAttributeValueExistsUnsaved(attributeName);
        }

        return this.renderDefault(attributeName, trackedEntityTypeName, classes.linkButton);
    }

    render() {
        const { classes } = this.props;

        return (
            <div
                className={classes.container}
            >
                {this.renderContents()}
            </div>
        );
    }
}

export const UniqueTEADuplicateErrorMessageCreator = withStyles(getStyles)(UniqueTEADuplicateErrorMessageCreatorPlain);
