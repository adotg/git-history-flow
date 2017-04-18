const ContributionHunk = class {
    constructor  (rangeStart, rangeEnd, meta) {
        this.range = [rangeStart, rangeEnd];
        this.meta = Object.assign({ }, meta);

        this._clones = [];
        this._clonedFrom = null;
    }

    static of (rangeStart, rangeEnd, meta) {
        return new ContributionHunk(rangeStart, rangeEnd, meta);
    }

    static clone (instance) {
        let newHunk = new ContributionHunk(instance.range[0], instance.range[1], instance.meta);

        instance._clones.push(newHunk);
        newHunk._clonedFrom = instance;
        return newHunk;
    }

    static cloneWithRange (instance, rangeStart, rangeEnd) {
        let newHunk = new ContributionHunk(rangeStart, rangeEnd, instance.meta);

        instance._clones.push(newHunk);
        newHunk._clonedFrom = instance;
        return newHunk;
    }

    updateRange (rangeStart, rangeEnd) {
        rangeStart = isFinite(rangeStart) ? rangeStart : this.range[0];
        rangeEnd = isFinite(rangeEnd) ? rangeEnd : this.range[1];

        this.range[0] = rangeStart;
        this.range[1] = rangeEnd;

        return this;
    }

    shift (delta) {
        this.range[0] += delta;
        this.range[1] += delta;
        return this;
    }
};

export { ContributionHunk as default };
