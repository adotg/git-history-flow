import { default as transducer } from './transducer';
import { default as walk } from './walk';
import { default as chart } from './chart';
import { default as Edge } from './edge';
import { default as store } from './store';
import { SnapshotSemantics, SnapshotPresentation } from './snapshot';

//import { changeMode } from './actions';

//console.log(store.getState());

//store.subscribe(() => {
    //console.log(store.getState());
//});

//setTimeout(() => {
    //store.dispatch(changeMode('LATEST_COMMIT_VIEW'));
//}, 2000);

const render = (conf, data) => {
    let walkable,
        res,
        i,
        l,
        ssSemantical,
        ssPresentational,
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

    ssSemantical = new SnapshotSemantics(snapshots, store);
    ssPresentational = new SnapshotPresentation(ssSemantical);
    ssSemantical.connect(ssPresentational);

    return chart(conf, ssSemantical, edges);
}

export { render as render };
