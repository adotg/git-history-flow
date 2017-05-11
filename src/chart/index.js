const d3 = require('./renderer');

import { default as utils } from '../utils';

function chart (conf, snapshot, edge, timeline) {
    let chartSVG,
        rootG,
        historyFlowG,
        timelineG,
        timelineBaseG,
        snapshotG,
        flowG,
        height,
        width,
        x,
        y,
        timeX,
        yMax,
        padding,
        data = snapshot.getData();

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
            .attr('transform', 'translate(' + padding.w + ', ' + padding.h + ')');

    historyFlowG = rootG 
        .append('g')
            .attr('class', 'hf-chart-group');
    
    timelineG = rootG 
        .append('g')
            .attr('class', 'hf-timeline-group');
    
    timelineBaseG = timelineG
        .append('g')
        .attr('class', 'hf-timeline-base');

    snapshotG = historyFlowG
        .append('g')
            .attr('class', 'hf-snapshot-group');
    
    flowG = historyFlowG
        .append('g')
            .attr('class', 'hf-flow-group');

    x = d3
        .scaleLinear()
        .domain([0, data.length - 1])
        .range([0, width - 2 * padding.w]);

    timeX = d3
        .scaleTime()
        .domain([utils.getNiceDate(data[0].data.timestamp), utils.getNiceDate(data[data.length - 1].data.timestamp, 1)])
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
        .range([50, height - 2 * padding.h]); // 50px for the timeline drawing
    
    timeline.render(timelineBaseG, { 
        x: 0, 
        y: 0,
        width: width - 2 * padding.w,
        height: 12 
    }, { x: x, timeX: timeX, y: y });
    snapshot.render(snapshotG, { x: x, y: y });
    edge.render(flowG, { x: x, y: y });
}

export { chart as default };
