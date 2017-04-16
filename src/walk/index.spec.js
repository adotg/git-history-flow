/* global describe it before */

import { expect } from 'chai';
import { default as walk } from '../walk';

class MockList {
    constructor (id) {
        this._prev = null;
        this.id = id;
    }
    
    isRoot () {
        return !this._prev;
    }

    prev () {
        return this._prev;
    }

    setPrev (inst) {
        this._prev = inst;
        return this;
    }
}

describe('Walk', function () {
    let list,
        walkable;

    before(function () {
        list = [1, 2, 3, 4, 5]
                    .map(d => new MockList(d))
                    .reduce((acc, item) => {
                        return item.setPrev(acc); 
                    }, new MockList(null));
    });

    describe('MockList', function () {
        it('generates the mocklist correctly', function () {
            let target, 
                res = [];
            
            target = list;
            while(!target.isRoot()) {
                res.push(target.id);
                target = target.prev();
            }

            expect(res).to.deep.equal([5, 4, 3, 2, 1]);
        });
    });

    before(function () {
        walkable = walk(list);
    });

    describe('#chainLength', function () {
        it('returns length of the chain', function () {
            expect(typeof walkable.chainLength).to.equal('number');
        });
        
        it('evaluates chain length correctly', function () {
            expect(walkable.chainLength).to.equal(5);
        });
    });

    describe('#next', function () {
        it('returns an iteraterable', function () {
            expect(typeof walkable.next).to.equal('function');
        });
        
        it('iterates the list from start to end', function () {
            let next, 
                res = [];
            
            next = walkable.next();
            while (!next.done) {
                res.push(next.value.id);
                next = walkable.next();
            }

            expect(res).to.deep.equal([1, 2, 3, 4, 5]);
        });
    });
});
