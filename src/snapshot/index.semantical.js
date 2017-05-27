import watch from 'redux-watch';

const SnapshotSemantics = class {
    constructor  (data, store) {
        this.data = data;
        this.store = store;

        this.presentation = null;
        this.unsubscribe = [];
    }

    connect (presentation) {
        this.presentation = presentation;
        this.presentation.setData(this.getData());
        
        this.unsubscribe = this.presentation.actions().map(action => {
            let watcher = watch(this.store.getState, action.path);
            return this.store.subscribe(() => requestAnimationFrame(watcher(action.executable)));
        });
        
        return this;
    }

    getData () {
        return this.data;
    }

    render (group, dependencies) {
        dependencies.store = this.store;
        this.presentation.render(group, this.store.getState(), dependencies);
        return this;
    }
};

export { SnapshotSemantics as default };
