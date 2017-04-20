import { default as transducer } from './transducer';
import { default as walk } from './walk';
import { default as chart } from './chart';
import { default as Edge } from './edge';

const render = (conf, data) => {
    let walkable,
        res,
        i,
        l,
        transducedRes,
        snapshots = [],
        edges = []; 

    transducedRes = transducer(data);
    walkable = walk(transducedRes);
    res = walkable.next();

    while (!res.done) {
        snapshots.push(res.value);
        res = walkable.next();
    }

    for ( i = 1, l = snapshots.length; i < l; i++) {
        edges.push(snapshots[i].hunks
            .filter(hunk => !!hunk._clonedFrom)
            .map(hunk => Edge.between(hunk, { index: i - 1 }, { index: i })));
    }

    return chart(conf, snapshots, edges);
}

export { render as render };
