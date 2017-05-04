/* global describe it before */

import { expect } from 'chai';
import { Edge } from '../edge';
import { default as ContributionHunk } from '../contribution-hunk';


describe('Edge', function () {
    let leftNode,
        rightNode,
        edge;

    before(function () {
        leftNode = ContributionHunk.of(10, 20, { color: '#ff0000' });
        rightNode = ContributionHunk.clone(leftNode).shift(5);
        edge = Edge.between(rightNode, { index: 0 }, { index: 1 });
    });

    describe('#between', function () {
        it('creates and returns instance of the edge', function () {
            expect(edge).to.be.instanceof(Edge);
        });
        
        it('has an attrubute which is equal to the movement', function () {
            expect(edge.attr).to.equal(5);
        });
    });

    describe('#boundary', function () {
        it('returns the boundary by value', function () {
            expect(edge.boundary()).to.be.deep.equal([[0, 20], [0, 10], [1, 15], [1, 25]]);
        });
    });
    
});
