const TimelineSemantics = class {
    constructor  (data, store) {
        this.data = data;
        this.store = store;

        this.presentation = null;
    }

    connect (presentation) {
        this.presentation = presentation;
        this.presentation.setData(this.getData());

        return this;
    }

    getData () {
        return this.data;
    }

    render (group, position, depencencies) {
        this.presentation.setPosition(position);
        this.presentation.render(group, this.store.getState(), depencencies);
        return this;
    }
};

export { TimelineSemantics as default };

