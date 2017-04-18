import { default as Snapshot } from '../snapshot';
import { default as utils } from '../utils';

const userColorMap = {},
    palette = utils.palette(),
    getColorForUser = (id) => {
        return userColorMap[id] || (userColorMap[id] = palette.next());
    },
    transducer = (rawData) => {
        return rawData
                .map(d => {
                    return Object.assign({ }, d, { color: getColorForUser(d.user.email) }); 
                })
                .reduce((acc, data) => {
                    return Snapshot
                            .with(acc, data)
                            .apply(data.changes); 
                }, Snapshot.root());
    };

export { transducer as default };
