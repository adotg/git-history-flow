const it = function* (snapshots) {
    const len = snapshots.length;
    let i = 0;

    while (i < len) {
        yield snapshots[i++];
    }
};

const walk = (snapshot) => {
    let target,
        snapshots = [];
    
    target = snapshot;
    while (!target.isRoot()) {
        snapshots.push(target);
        target = target.prev();
    }
    
    snapshots = snapshots.reverse();
    
    return it(snapshots);
};

export { walk as default };
