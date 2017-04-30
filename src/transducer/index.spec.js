/* global describe it before */

import { expect } from 'chai';
import { default as transducer } from '../transducer';
import { default as Snapshot } from '../snapshot';

const data = [
    { diff: { changes: [0, 0, 1, 24] }, user: { email: 'a@domain.com' }, "timestamp": "2017-03-01 20:54:47 +0530" },
    { diff: { changes: [19, 1, 16, 1] }, user: { email: 'b@domain.com' }, "timestamp": "2017-03-01 23:54:47 +0530" },
    { diff: { changes: [12, 0, 13, 5] }, user: { email: 'c@domain.com' }, "timestamp": "2017-03-02 23:54:47 +0530" },
    { diff: { changes: [12, 0, 13, 3] }, user: { email: 'd@domain.com' }, "timestamp": "2017-03-03 23:54:47 +0530" }
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
