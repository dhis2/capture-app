
type Constant = {
    id: string;
    displayName: string;
    value: unknown;
};

class ConstantStore {
    private _constants: Constant[] | undefined;

    set(constants: Constant[]): void {
        this._constants = constants;
    }

    get(): Constant[] | undefined {
        return this._constants;
    }
}

export const constantsStore = new ConstantStore();
