const it = function* (snapshots) {
    const len = snapshots.length;
    let i = 0;

    while (i < len) {
        yield snapshots[i++];
    }
};

const walk = (snapshot) => {
    let target,
        itr,
        chainLength = 0,
        snapshots = [];
    
    target = snapshot;
    while (!target.isRoot()) {
        snapshots.push(target);
        target = target.prev();
        chainLength++;
    }
    
    snapshots = snapshots.reverse();
    itr = it(snapshots);
    itr.chainLength = chainLength;
    
    return itr;
};

export { walk as default };
