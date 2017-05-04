const Edge = class {
    constructor (right, leftBoundary, rightBoundary) {
        this.rightNode = right;
        this.leftBoundary = leftBoundary;
        this.rightBoundary = rightBoundary;

        this.attr = right.movement;
    }

    static between (right, leftBoundary, rightBoundary) {
        return new Edge(right, leftBoundary, rightBoundary);
    }

    boundary () {
        let bottom = this.rightNode.range[0],
            top = this.rightNode.range[1];

        return [
            [ this.leftBoundary.index, top - this.attr ],
            [ this.leftBoundary.index, bottom - this.attr ],
            [ this.rightBoundary.index, bottom ],
            [ this.rightBoundary.index, top ]
        ];
    }

    meta () {
        return this.rightNode.meta;
    }
};

export { Edge as default };
