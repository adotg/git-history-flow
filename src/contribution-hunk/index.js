const ContributionHunk = class {
    constructor  (rangeStart, rangeEnd, meta) {
        this.range = [rangeStart, rangeEnd];
        this.meta = Object.assign({ }, meta);
        this.recent = true;

        this._clones = [];
        this._clonedFrom = null;
        this.movement = 0;
        this.removeFlag = rangeStart > rangeEnd ? true : false;
    }

    static of (rangeStart, rangeEnd, meta) {
        return new ContributionHunk(rangeStart, rangeEnd, meta);
    }

    static clone (instance) {
        let newHunk = new ContributionHunk(instance.range[0], instance.range[1], instance.meta);

        instance._clones.push(newHunk);
        newHunk._clonedFrom = true;
        newHunk.recent = false;
    
        return newHunk;
    }

    static cloneWithRange (instance, rangeStart, rangeEnd) {
        let newHunk = new ContributionHunk(
            rangeStart || instance.range[0], 
            rangeEnd || instance.range[1], 
            instance.meta);

        instance._clones.push(newHunk);
        newHunk._clonedFrom = true;
        newHunk.movement = instance.movement;
        newHunk.recent = false;
        return newHunk;
    }

    static merge(hunks) {
        let newItem;

        return hunks.reduce((acc, item, i, hunks) => {
            if (!i) {
                newItem = this.cloneWithRange(item, item.range[0], item.range[1]);
                newItem._clonedFrom = item._clonedFrom;
                newItem.recent = item.recent;
                return (acc.push(newItem), acc);
            }

            if(item.meta.user.email === hunks[i - 1].meta.user.email && item.movement === hunks[i - 1].movement &&
                item._clonedFrom === hunks[i - 1]._clonedFrom && !item.recent) {
                acc[acc.length - 1].updateRange(undefined, item.range[1]);
            } else {
                newItem = this.cloneWithRange(item, item.range[0], item.range[1]);
                newItem._clonedFrom = item._clonedFrom;
                newItem.recent = item.recent;
                acc.push(newItem);
            }
            return acc;
        }, []);
    }

    updateRange (rangeStart, rangeEnd) {
        rangeStart = isFinite(rangeStart) ? rangeStart : this.range[0];
        rangeEnd = isFinite(rangeEnd) ? rangeEnd : this.range[1];

        this.range[0] = rangeStart;
        this.range[1] = rangeEnd;
        this.removeFlag = rangeStart > rangeEnd ? true : false;

        return this;
    }

    shift (delta) {
        this.range[0] += delta;
        this.range[1] += delta;
        this.movement += delta;
        return this;
    }

    removable (flag) {
        this.removeFlag = flag;
        return this;
    }
};

export { ContributionHunk as default };
