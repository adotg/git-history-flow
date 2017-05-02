/* global describe it before */

import { expect } from 'chai';
import { Snapshot } from '../snapshot';


describe('Snapshot', function() {
    describe('#transact', function() {
        let firstSnapshot,
            secondSnapshot,
            thirdSnapshot,
            fourthSnapshot,
            fifthSnapshot,
            sixthSnapshot;
        
        before(function () {
            firstSnapshot = Snapshot
                            .with()
                            .transact([[0, 0, 1, 7]]);
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
        
        before(function () {
            secondSnapshot = Snapshot
                                .with(firstSnapshot)
                                .transact([[0, 0, 8, 3]]);
        });

        describe('addition of new content at the end of the file', function () {
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
                expect(secondSnapshot.tracker).to.deep.equal([null].concat(Array(7).fill(0)).concat(Array(3).fill(1)));
            });
        });
        
        before(function () {
            thirdSnapshot = Snapshot
                                .with(secondSnapshot)
                                .transact([[0, 0, 8, 2]]);
        });

        describe('addition of new content at the middle of the file where just one hunk starts', function () {
            it('creates three hunks', function() {
                expect(thirdSnapshot.hunks.length).to.equal(3);
            });
            
            it('retains range of the first hunk', function() {
                expect(thirdSnapshot.hunks[0].range).to.deep.equal([1, 7]);
            });
            
            it('creates the second hunk with range indicating the incremental changes', function() {
                expect(thirdSnapshot.hunks[1].range).to.deep.equal([8, 9]);
            });
            
            it('creates the third hunk with the range but shifted by the incremental change', function() {
                expect(thirdSnapshot.hunks[2].range).to.deep.equal([10, 12]);
            });

            it('creates a single tracker for hunks which points to hunks for all the lines', function() {
                expect(thirdSnapshot.tracker).to.deep.equal(
                    [null]
                        .concat(Array(7).fill(0))
                        .concat(Array(2).fill(1))
                        .concat(Array(3).fill(2)));
            });
        });
        
        before(function () {
            fourthSnapshot = Snapshot
                                .with(thirdSnapshot)
                                .transact([[0, 0, 5, 1]]);
        });

        describe('addition of new content in middle of a hunk', function () {
            it('creates five hunks', function() {
                expect(fourthSnapshot.hunks.length).to.equal(5);
            });
            
            it('cuts the first hunks into two and reduces the first hunks range', function() {
                expect(fourthSnapshot.hunks[0].range).to.deep.equal([1, 4]);
            });
            
            it('creates the second hunk with range indicating the incremental changes', function() {
                expect(fourthSnapshot.hunks[1].range).to.deep.equal([5, 5]);
            });
            
            it('creates the third hunk with the remaining range of the prev first hunk', function() {
                expect(fourthSnapshot.hunks[2].range).to.deep.equal([6, 8]);
            });

            it('creates a single tracker for hunks which points to hunks for all the lines', function() {
                expect(fourthSnapshot.tracker).to.deep.equal(
                    [null]
                        .concat(Array(4).fill(0))
                        .concat(Array(1).fill(1))
                        .concat(Array(3).fill(2))
                        .concat(Array(2).fill(3))
                        .concat(Array(3).fill(4)));
            });
        });
        
        before(function () {
            fifthSnapshot = Snapshot
                                .with(thirdSnapshot)
                                .transact([[0, 0, 7, 1]]);
        });
        
        describe('addition of new content where the hunk ends', function () {
            it('cuts the first hunks into two and reduces the first hunks range by one', function() {
                expect(fifthSnapshot.hunks[0].range).to.deep.equal([1, 6]);
            });
            
            it('creates the second hunk with range indicating the incremental changes', function() {
                expect(fifthSnapshot.hunks[1].range).to.deep.equal([7, 7]);
            });
            
            it('creates the third hunk with the remaining range of the prev first hunk', function() {
                expect(fifthSnapshot.hunks[2].range).to.deep.equal([8, 8]);
            });

            it('creates a single tracker for hunks which points to hunks for all the lines', function() {
                expect(fifthSnapshot.tracker).to.deep.equal(
                    [null]
                        .concat(Array(6).fill(0))
                        .concat(Array(1).fill(1))
                        .concat(Array(1).fill(2))
                        .concat(Array(2).fill(3))
                        .concat(Array(3).fill(4)));
            });
        });

        before(function () {
            sixthSnapshot = Snapshot
                                .with(fifthSnapshot)
                                .transact([[3, 2, 1, 0]]);
        });

        describe('deletion of content which spans only one hunk', function () {
            it('splits the hunk in the middle to create thre hunk, deletes the middle hunk to leave with two hunks',
                function () {
                    expect(sixthSnapshot.hunks.length).to.equal(6);
                });
            
            it('updates the tracker to indicate the split of the hunk which has been affected', function () {
                expect(sixthSnapshot.tracker).to.deep.equal(
                    [null]
                        .concat(Array(2).fill(0))
                        .concat(Array(2).fill(1))
                        .concat(Array(1).fill(2))
                        .concat(Array(1).fill(3))
                        .concat(Array(2).fill(4))
                        .concat(Array(3).fill(5)));
            });
        });
    });
});
