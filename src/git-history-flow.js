import { default as transducer } from './transducer';
import { default as walk } from './walk';
import { default as chart } from './chart';

const render = (conf, data) => {
    let walkable,
        res,
        transducedRes,
        snapshots = []; 

    transducedRes = transducer(data);
    walkable = walk(transducedRes);
    res = walkable.next();

    while (!res.done) {
        snapshots.push(res.value);
        res = walkable.next();
    }

    return chart(conf, snapshots);
}

export { render as render };
