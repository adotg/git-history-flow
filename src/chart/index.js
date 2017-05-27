import { focus } from '../actions';
import { default as utils } from '../utils';

const d3 = require('./renderer');

function chart (conf, snapshot, edge, timeline, dependencies) {
    let chartSVG,
        rootG,
        timelineG,
        historyFlowG,
        snapshotG,
        flowG,
        focusMockerG,
        height,
        width,
        x,
        y,
        timeX,
        yMax,
        padding,
        params,
        allMS,
        iLayer,
        store = dependencies.store,
        data = snapshot.getData();
    
    conf.width = conf.mountPoint.clientWidth;
    conf.height = conf.mountPoint.clientHeight;

    chartSVG = 
        d3.select(conf.mountPoint)
            .append('svg')
                .attr('class', 'hf-svg')
                .attr('version', '1.1')
                .attr('xmlns', 'http://www.w3.org/2000/svg')
                .attr('height', height = conf.height)
                .attr('width', width = conf.width); 

    padding = {
        h: height * 0.05,
        w: width * 0.05
    };

    rootG = chartSVG
        .append('g')
            .attr('class', 'hf-root-group')
            .attr('transform', 'translate(' + padding.w + ', ' + 0 + ')');

    timelineG = rootG
        .append('g')
        .attr('class', 'hf-timeline-group');

    historyFlowG = rootG 
        .append('g')
            .attr('class', 'hf-chart-group');
    
    snapshotG = historyFlowG
        .append('g')
            .attr('class', 'hf-snapshot-group');

    flowG = historyFlowG
        .append('g')
            .attr('class', 'hf-flow-group');

    focusMockerG = rootG
        .append('g')
            .attr('class', 'hf-mocker-group');

    iLayer = rootG
        .append('rect')
        .attr('class', 'hf-ilayer')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width - 2 * padding.w)
        .attr('height', height - 2 * padding.h);

    x = d3
        .scaleLinear()
        .domain([0, data.length - 1])
        .range([0, width - 2 * padding.w]);

    timeX = d3
        .scaleTime()
        .domain([data[0].data.timestamp, data[data.length - 1].data.timestamp, 1])
        .range([0, width - 2 * padding.w]);

    yMax = data
        .reduce((acc, snapshot) => {
            let max = snapshot.getMax();
            if (acc < max) {
                return max;
            }
            return acc;
        }, Number.NEGATIVE_INFINITY);

    y = d3
        .scaleLinear()
        .domain([0, yMax])
        .range([0, height - padding.h]);


    params = {
        x: x,
        timeX: timeX,
        y: y,
        yMax: yMax,
        focusMocker: focusMockerG
    };
    
    timeline.render(timelineG, {
        y: height
    }, params);
    snapshot.render(snapshotG, params);
    edge.render(flowG, params);

    requestAnimationFrame(() => {
        allMS = snapshot.data.map(s => s.data.timestamp.getTime());
        iLayer
            .on('mousemove', function () {
                let index,
                    state = store.getState();

                if (state.xType === 'ORDINAL_X') {
                    index = Math.round(x.invert(d3.mouse(this)[0]));
                } else if (state.xType === 'TIME_X') {
                    index = utils.search(allMS, Math.round(timeX.invert(d3.mouse(this)[0])));
                } else {
                    index = null;
                }

                store.dispatch(focus(index));
            })
            .on('mouseout', function () {
                store.dispatch(focus(null));
            });
    });

}

export { chart as default };
