import { default as transducer } from './transducer';
import { default as walk } from './walk';
import { default as chart } from './chart';
import { default as store } from './store';
import { Edge, EdgeSemantics, EdgePresentation } from './edge';
import { SnapshotSemantics, SnapshotPresentation } from './snapshot';
import { TimelineSemantics, TimelinePresentation } from './timeline';
import watch from 'redux-watch';
import { all } from './actions';

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
            .map(hunk => Edge.between(
                hunk, 
                { index: i - 1, snapshot: snapshots[i -1] }, 
                { index: i, snapshot: snapshots[i] }
            )));
    }

    chart(
        conf, 
        new SnapshotSemantics(snapshots, store).connect(new SnapshotPresentation()),
        new EdgeSemantics(edges, store).connect(new EdgePresentation()),
        new TimelineSemantics(snapshots, store).connect(new TimelinePresentation()),
        { store: store }
    );

    return {
        store: store,
        watch: watch,
        actions: all,
        snapshots: snapshots
    };
}

export { render as render };
