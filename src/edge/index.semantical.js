const EdgeSemantics = class {
    constructor  (data, store) {
        this.data = data;
        this.store = store;

        this.presentation = null;

        this.unsubscribe = store.subscribe(() => {
            this.presentation.action(store.getState());
        });
    }

    connect (presentation) {
        this.presentation = presentation;
        this.presentation.setData(this.getData());

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
