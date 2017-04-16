/* global describe it before */

import { expect } from 'chai';
import { default as transducer } from '../transducer';
import { default as Snapshot } from '../snapshot';

const data = [
    { changes: [0, 0, 1, 24] },
    { changes: [19, 1, 16, 1] },
    { changes: [12, 0, 13, 5] },
    { changes: [12, 0, 13, 3] }
];


describe('Transducer', function () {
    let res;

    before(function() {
        res = transducer(data);
    });

    describe('transducer', function () {
        it('reduces to a type of Snapshot', function () {
            expect(res).to.be.instanceof(Snapshot);
        });
        
        it('creates a snapshot chain returning the last item in the chain', function () {
            expect(res.prevSnapshot).to.be.instanceof(Snapshot);
        });
    });
});
