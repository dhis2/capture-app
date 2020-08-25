// @flow
import { connect } from 'react-redux';
import { SelectorsBuilder } from './SelectorsBuilder.component';
import { makeColumnsSelector } from './selectorsBuilder.selector';

const makeMapStateToProps = () => {
    const columnsSelector = makeColumnsSelector();

    const mapStateToProps = (state: ReduxState, props: Object) => ({
        columns: columnsSelector(state, props),
    });
    return mapStateToProps;
};

const mapDispatchToProps = () => ({
});

// $FlowFixMe[missing-annot] automated comment
export default connect(makeMapStateToProps, mapDispatchToProps)(SelectorsBuilder);
