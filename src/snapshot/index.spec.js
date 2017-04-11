import { expect } from 'chai';
import { default as Snapshot } from '../snapshot';


describe('Snapshot', function() {
    describe('#apply', function() {
        let firstSnapshot;
        
        before(function () {
            firstSnapshot = Snapshot
                            .with()
                            .apply([0, 0, 1, 7]);
        });
        
        describe('first snapshot i.e. first time commit', function () {
            it('creates only one hunk', function() {
                expect(firstSnapshot.hunks.length).to.equal(1);
            });
            
            it('creates a single hunk which represents all the lines', function() {
                expect(firstSnapshot.hunks[0].range).to.deep.equal([1, 7]);
            });

            it('creates a single tracker for hunks which points to a single hunk for all the lines', function() {
                expect(firstSnapshot.tracker).to.deep.equal([null].concat(Array(7).fill(0)));
            });
        });
        
        describe('addition of new content at the end of the file', function () {
            let secondSnapshot;
            
            before(function () {
                secondSnapshot = Snapshot
                                    .with(firstSnapshot)
                                    .apply([0, 0, 8, 3]);
            });

            it('creates two hunks', function() {
                expect(secondSnapshot.hunks.length).to.equal(2);
            });
            
            it('retains range of the first hunk', function() {
                expect(secondSnapshot.hunks[0].range).to.deep.equal([1, 7]);
            });
            
            it('creates the second hunk with range indicating the incremental changes', function() {
                expect(secondSnapshot.hunks[1].range).to.deep.equal([8, 10]);
            });

            it('creates a single tracker for hunks which points to hunks for all the lines', function() {
                expect(secondSnapshot.tracker).to.deep.equal([null].concat(Array(7).fill(0))
                                                                    .concat(Array(3).fill(1)));
            });
        });
    });
});
