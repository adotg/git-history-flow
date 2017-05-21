import watch from 'redux-watch';

const EdgeSemantics = class {
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

    render (group, depencencies) {
        this.presentation.render(group, this.store.getState(), depencencies);
        return this;
    }
};

export { EdgeSemantics as default };
