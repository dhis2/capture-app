export default class ProgramStage {
    _stageForm: RenderFoundation,
    _relationshipTypes: Array<RelationshipType>,

    get stageForm(): RenderFoundation {
        return this._stageForm;
    }

    set stageForm(stageForm: RenderFoundation) {
        this._stageForm = stageForm;
    }
}
