// @flow
import * as React from 'react';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import ClearIcon from '@material-ui/icons/Clear';
import RelationshipTypeSelector from './RelationshipTypeSelector/RelationshipTypeSelector.component';

type Props = {
    classes: {
        container: string,
    }
}

const getStyles = theme => ({
    container: {

    },
});

class NewRelationship extends React.Component<Props> {
    render() {
        const { classes, ...passOnProps } = this.props;
        return (
            <div className={this.props.classes.container}>
                <RelationshipTypeSelector
                    {...passOnProps}
                />
            </div>
        );
    }
}

export default withStyles(getStyles)(NewRelationship);
