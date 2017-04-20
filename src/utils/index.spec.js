/* global describe it before */

import { expect } from 'chai';
import { default as utils } from '../utils';

describe('utils', function () {
    describe('palette', function () {
        let palette;

        before(function () {
            palette = utils.palette();
        });

        it('is of size 24', function () {
            expect(palette.size()).to.equal(16);
        });
        
        it('has an iterator which rotates', function () {
            let last,
                i = palette.size(),
                first = palette.next();

            while (i--) {
                last = palette.next();
            }
            expect(first).to.equal(last);
        });

        it('can reset the counter', function () {
            let resetVal, 
                first,
                i = 4;

            palette.reset();
            first = palette.next();
            while (i--) {
                palette.next();
            }
            palette.reset();
            resetVal = palette.next();

            expect(first).to.equal(resetVal);
        });
    });
});
