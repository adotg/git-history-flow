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

    boundary (equiDistant) {
        let lx,
            rx,
            bottom = this.rightNode.range[0],
            top = this.rightNode.range[1];

        if (equiDistant) {
            lx = this.leftBoundary.index;
            rx = this.rightBoundary.index;
        } else {
            lx = this.leftBoundary.snapshot.data.timestamp;
            rx = this.rightBoundary.snapshot.data.timestamp;
        }


        return [
            [ lx, top - this.attr ],
            [ lx, bottom - this.attr ],
            [ rx, bottom ],
            [ rx, top ]
        ];
    }

    meta () {
        return this.rightNode.meta;
    }
};

export { Edge as default };
