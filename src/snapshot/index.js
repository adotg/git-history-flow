import { default as ContributionHunk } from '../contribution-hunk';

const Snapshot = class {
    constructor  (prevSnapshot) {
        this.prevSnapshot = prevSnapshot;
        
        this.tracker = prevSnapshot && prevSnapshot.tracker.slice(0) || [null];
        this.hunks = prevSnapshot && prevSnapshot.hunks.map(d => ContributionHunk.clone(d)) || [];
    }

    static with (prevSnapshot) {
        return new Snapshot(prevSnapshot);
    }

    apply (command) {
        // @temp Only addition is implemented 
        this._applyAddition(command[2], command[3]);

        return this;
    }

    _applyRemove (start, change) {
        if (!change) {
            return this;
        }

       return this; 
    }
    
    _applyAddition (start, change) {
        let index,
            hunk,
            indexToHunk,
            end;

        if (!change) {
            return this;
        }

        if (this.tracker.length - 1 < start) {
            index = this.hunks.push(ContributionHunk.of(start, start + change - 1));
            this.tracker = this.tracker.concat(Array(change).fill(index - 1));
        } else {
            indexToHunk = this.tracker[start]; 
            hunk = this.hunks[indexToHunk];
            
            if(hunk.range[0] !== start) {
                end = this.hunk.range[1];
                this.hunk.updateRange(undefined, start - 1);
                
                this.hunks = this.hunks
                                .slice(0, indexToHunk)
                                .concat(ContributionHunk.of(start, end))
                                .concat(this.hunks.slice(indexToHunk));

                this.tracker = this.tracker
                                .slice(0, start)
                                .concat(Array(end - start -1).fill(indexToHunk))
                                .concat(this.tracker.slice(indexToHunk).map(d => d + 1));
            }
            
            this.hunks = this.hunks
                    .slice(0, indexToHunk)
                    .concat(ContributionHunk.of(start, start + change - 2))
                    .concat(
                        this.hunks
                            .slice(index)
                            .forEach((_hunk) => _hunk.shift(change))
                    );

            this.tracker = this.tracker
                .slice(1, start)
                .concat(Array(change).fill(indexToHunk))
                .concat(
                    this.tracker
                        .slice(start)
                        .map(d => d + 1)
                );
        }

        return this;
    }
};

export { Snapshot as default };
