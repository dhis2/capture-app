// @flow
import * as React from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import {
  TextField,
  withDefaultFieldContainer,
  withLabel,
  withInternalChangeHandler,
  withFocusSaver,
} from '../../../../FormFields/New';
import Button from '../../../../Buttons/Button.component';
import { Section } from '../../../../Section';

const TextFieldWithContainer = withFocusSaver()(
  withInternalChangeHandler()(withDefaultFieldContainer()(withLabel()(TextField))),
);

type Props = {};

type State = {
  dialogOpen: boolean,
};
class SaveWorkingListConfigDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { dialogOpen: false };
  }

  handleOpenDialog = () => {
    this.setState({ dialogOpen: true });
  };

  render() {
    return (
      <div>
        <Button onClick={this.handleOpenDialog}>Save as..</Button>
        <Dialog open={this.state.dialogOpen}>
          <DialogContent>
            <div>
              <Section>
                <TextFieldWithContainer label="Name" />
                <TextFieldWithContainer label="Description" />
              </Section>
              <div>
                <Button
                  onClick={() => {
                    // $FlowFixMe[prop-missing] automated comment
                    this.props.onAddWorkingListConfig('Test working list', 'desc');
                  }}
                >
                  Save
                </Button>
                <Button>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default SaveWorkingListConfigDialog;
