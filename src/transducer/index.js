import { default as Snapshot } from '../snapshot';

const transducer = (rawData) => {
    return rawData
            .reduce((acc, data) => {
                return Snapshot.with(acc).apply(data.changes); 
            }, Snapshot.root());
};

export { transducer as default };
