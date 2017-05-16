import { default as ContributionHunk } from '../contribution-hunk';
import { default as utils } from '../utils';
import { default as Color } from 'color';

const Snapshot = class {
    constructor  (prevSnapshot = Snapshot.root(), data = null) {
        if (prevSnapshot === null) {
            this.prevSnapshot = null;
            this.tracker = [null];
            this.hunks = [];
        } else {
            this.prevSnapshot = prevSnapshot;
            this.tracker = prevSnapshot.tracker.slice(0);
            this.hunks = prevSnapshot.hunks.map(d => ContributionHunk.clone(d));
        }
        this.data = this._parse(data);
    }

    static with (prevSnapshot, data) {
        return new Snapshot(prevSnapshot, data);
    }

    static root () {
        return new Snapshot(null);
    }

    isRoot () {
        return !this.prevSnapshot;
    }

    prev () {
        return this.prevSnapshot;
    }

    _parse (data) {
        let parsedData,
            color;

        if (!data) {
            return null;
        }
        
        parsedData = Object.assign({}, data);
        parsedData.timestamp = utils.ISO8601toNativeDate(parsedData.timestamp);
        color = Color(parsedData.color);
        parsedData.flowColor = color.rgb().opaquer(-0.5);
       
        return parsedData;
    }

    transact (commands) {
        let deleted,
            added,
            delta = 0;

        commands.forEach(command => {
            deleted = command[1];
            added = command[3];

            this
                ._atomicRemoveTransaction(command[0], deleted, delta)
                ._atomicAdditionTransaction(command[2], added, delta);

            delta += (-deleted + added);
        });

        this.hunks = ContributionHunk.merge(this.hunks);
        this.tracker = this.hunks.reduce((acc, hunk, i) => {
            return acc.concat(Array(hunk.range[1] - hunk.range[0] + 1).fill(i));
        }, [null]);

        return this;
    }

    _atomicRemoveTransaction (start, change, delta) {
        let startHunkIndex,
            endHunkIndex,
            hunk,
            hunkTop,
            hunkBottom,
            end;

        if (!change) {
            return this;
        }
    
        start += delta;

        startHunkIndex = this.tracker[start];
        endHunkIndex = this.tracker[end = start + change - 1];

        if (startHunkIndex === endHunkIndex) {
            hunk = this.hunks[startHunkIndex];
            
            this.hunks = this.hunks
                            .slice(0, startHunkIndex + 1)
                            .concat(ContributionHunk.of(start, end).removable(true))
                            .concat(ContributionHunk.cloneWithRange(hunk, end + 1))
                            .concat(this.hunks.slice(startHunkIndex + 1));
            
            hunk.updateRange(undefined, start - 1);
        } else {
            hunkTop = this.hunks[startHunkIndex];
            hunkBottom = this.hunks[endHunkIndex];
            
            this.hunks = this.hunks
                            .slice(0, startHunkIndex + 1)
                            .concat(ContributionHunk.of(start, hunkTop.range[1]).removable(true))
                            .concat(this.hunks.slice(startHunkIndex + 1, endHunkIndex).map(h => h.removable(true)))
                            .concat(ContributionHunk.cloneWithRange(hunkBottom, undefined, end).removable(true))
                            .concat(ContributionHunk.cloneWithRange(hunkBottom, end + 1))
                            .concat(this.hunks.slice(endHunkIndex + 1));
        
            hunkTop.updateRange(undefined, start - 1);
            hunkBottom.updateRange(end + 1);
        }

        this.hunks.reduce((acc, _hunk, i) => {
            if (!_hunk.removeFlag) {
                _hunk.shift(-acc.delta);
            } else {
                acc.delta += _hunk.range[1] - _hunk.range[0] + 1;
                acc.removables.push(i);
            }

            return acc;
        }, { delta: 0, removables: [] });

        this.hunks = this.hunks.filter(_hunk => !_hunk.removeFlag);
        this.tracker = this.hunks.reduce((acc, _hunk, i) => {
            return acc.concat(Array(_hunk.range[1] - _hunk.range[0] + 1).fill(i));
        }, [null]);
        
        return this; 
    }
    
    _atomicAdditionTransaction (start, change) {
        let index,
            hunk,
            indexToHunk,
            end;

        if (!change) {
            return this;
        }

        if (this.tracker.length - 1 < start) {
            index = this.hunks.push(ContributionHunk.of(start, start + change - 1, this.data));
            this.tracker = this.tracker.concat(Array(change).fill(index - 1));
        } else {
            indexToHunk = this.tracker[start]; 
            hunk = this.hunks[indexToHunk];
            
            if(hunk.range[0] !== start) {
                end = hunk.range[1];
                hunk.updateRange(undefined, start - 1);
                
                this.hunks = this.hunks
                                .slice(0, indexToHunk + 1)
                                .concat(ContributionHunk.cloneWithRange(hunk, start, end))
                                .concat(this.hunks.slice(indexToHunk + 1));

                this.tracker = this.tracker
                                .slice(0, start)
                                .concat(this.tracker.slice(start).map(d => d + 1));

                indexToHunk++;
            }
            
            this.hunks = this.hunks
                    .slice(0, indexToHunk)
                    .concat(ContributionHunk.of(start, start + change - 1, this.data))
                    .concat(
                        this.hunks
                            .slice(indexToHunk)
                            .map((_hunk) => _hunk.shift(change))
                    );

            this.tracker = this.tracker
                .slice(0, start)
                .concat(Array(change).fill(indexToHunk))
                .concat(
                    this.tracker
                        .slice(start)
                        .map(d => d + 1)
                );
        }

        return this;
    }

    getMax () {
        return this.hunks[this.hunks.length - 1].range[1];
    }
};

export { Snapshot as default };
