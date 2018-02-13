// @flow
import { connect } from 'react-redux';
import FormBuilder from '../../__TEMP__/FormBuilder.component';
import { cacheFormBuilderState } from './formBuilder.actions';

const mapStateToProps = (state: ReduxState, props: { id: string }) => ({
    cachedFieldsState: state.formsSectionsFieldsUI[props.id],
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onCacheFieldsState: (formState: Object, id: string) => {
        dispatch(cacheFormBuilderState(formState, id));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(FormBuilder);
