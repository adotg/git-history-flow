import { expect } from 'chai'
import { default as ContributionHunk } from '../contribution-hunk'


describe('ContributionHunk ', function() {
    let hunk;
    
    before(function () {
        hunk = new ContributionHunk(0, 7);
    });

    describe('#of', function() {
        it('returns a new instance of the class', function() {
            expect(hunk).to.be.an.instanceof(ContributionHunk);
        });
        
        it('creates an instance with range which is as same as the input', function() {
            expect(hunk.range).to.deep.equal([0, 7]);
        });
    });

    
    describe('#updateRange', function() {
        it('happens with multiple parameters', function() {
            expect(hunk.updateRange(3, 6).range).to.deep.equal([3, 6]);
        });
        
        it('happens with single parameter keeping the other range untouched', function() {
            expect(hunk.updateRange(undefined, 11).range).to.deep.equal([3, 11]);
            expect(hunk.updateRange(1, undefined).range).to.deep.equal([1, 11]);
        });
    });

    describe('#shift', function() {
        it('shifts the start and end', function() {
            expect(hunk.updateRange(3, 6).shift(5).range).to.deep.equal([8, 11]);
        });
    });
        
    describe('#clone', function() {
        let clone;

        before(function () {
            clone = ContributionHunk.clone(hunk);
        });

        it('clones an instance and which is a different instance from which it was cloned', function() {
            expect(clone).to.not.equal(hunk);
        });
        
        it('creates a clone with a range which is same as the original', function() {
            expect(clone.range).to.deep.equal(hunk.range);
        });
        
        it('keeps track of the clones created', function() {
            expect(hunk._clones.length).to.equal(1);
        });
        
        it('saves the source reference to the cloned object', function() {
            expect(clone._clonedFrom).to.equal(hunk);
        });
    });
});
