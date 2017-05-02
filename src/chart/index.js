const d3 = require('./renderer');
const SmartLabelManager = require('fusioncharts-smartlabel');

import { default as utils } from '../utils';

function chart (conf, data, edges) {
    let chartSVG,
        rootG,
        historyFlowG,
        timelineG,
        timelineBaseG,
        timelineSnapshotG,
        timelineTextG,
        axisLinesG,
        yAxisLinesG,
        xAxisLinesG,
        snapshotG,
        flowG,
        height,
        width,
        x,
        y,
        timeX,
        yMax,
        effectiveHeight,
        padding,
        dayDurationInPx,
        smartlabel = new SmartLabelManager(0);

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

    timelineSnapshotG = timelineG
        .append('g')
        .attr('class', 'hf-timeline-snapshot');

    timelineTextG = timelineG
        .append('g')
        .attr('class', 'hf-timeline-text');

    axisLinesG = historyFlowG
        .append('g')
            .attr('class', 'hf-axislines-group');
    
    yAxisLinesG = axisLinesG
        .append('g')
            .attr('class', 'hf-y-axislines-group');
    
    xAxisLinesG = axisLinesG
        .append('g')
            .attr('class', 'hf-x-axislines-group');
    
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
        .range([0, effectiveHeight = height - 2 * padding.h - 50]); // 50px for the timeline drawing

    yAxisLinesG 
        .selectAll('path')
        .data(data)
        .enter()
        .append('path')
            .attr('d', (d, i) => { 
                let xVal = x(i);
                return 'M' + xVal + ',0' + 'L' + xVal + ',' + effectiveHeight;
            });
    
    xAxisLinesG
        .append('g')
        .selectAll('path')
        .data([0])
        .enter()
        .append('path')
            .attr('d', (d) => { 
                let yVal = y(d);
                return 'M0,' + yVal + 'L' + (width - 2 * padding.w) + ',' + yVal;
            });

    timelineBaseG
        .selectAll('path')
        .data([1])
        .enter()
        .append('path')
            .attr('d', () => { 
                let yVal = height - 2 * padding.h;
                return 'M0,' + yVal + 'L' + (width - 2 * padding.w) + ',' + yVal;
            });
    
    smartlabel.setStyle({
        'font-size': '10px',
        'font-family': 'monospace'
    });
    timelineTextG
        .selectAll('text')
        .data(utils.niceDateTicks(data[0].data.timestamp, data[data.length - 1].data.timestamp))
        .enter('text')
        .append('text')
            .text(d => d)
            .attr('text-anchor', 'middle')
            .attr('x', (d, i) => {
                let dim = smartlabel.getOriSize(d);
                if (i) {
                    return x(data.length - 1) - dim.width * 1 / 4; 
                } else {
                    return x(0) + dim.width * 1 / 4;
                }
            })
            .attr('y', () => {
                let yVal = height - 2 * padding.h;
                return yVal + smartlabel.getOriSize('W').height * 1.5;
            })
            .style('font-family', 'monospace')
            .style('font-size', '10px');

    snapshotG 
        .selectAll('.hf-atomic-snapshot-g')
        .data(data)
        .enter()
        .append('g')
            .attr('class', '.hf-atomic-snapshot-g')
            .selectAll('rect')
            .data((d, i) => 
                d.hunks.map(hunk => 
                    ({ hunk: hunk, groupIndex: i })))
            .enter()
            .append('rect')
                .attr('x', d => d._plotXStartPos = x(d.groupIndex - .05)) 
                .attr('y', d => d._plotYStartPos = y(d.hunk.range[0] - 1)) 
                .attr('width', d => x(d.groupIndex + .05) - d._plotXStartPos) 
                .attr('height', d => y(d.hunk.range[1]) - d._plotYStartPos)
                .style('fill', d => d.hunk.meta.color);

    flowG 
        .selectAll('.hf-atomic-flow-g')
        .data(edges)
        .enter()
        .append('g')
            .attr('class', '.hf-atomic-flow-g')
            .selectAll('path')
            .data(d => d)
            .enter()
            .append('path')
                .attr('d', d => {
                    let boundary = d.boundary();

                    return 'M' + x(boundary[0][0] + 0.05) + ',' + y(boundary[0][1]) + 
                        'L' + x(boundary[1][0] + 0.05) + ',' + y(boundary[1][1] - 1) + 
                        'L' + x(boundary[2][0] - 0.05) + ',' + y(boundary[2][1] - 1) +  
                        'L' + x(boundary[3][0] - 0.05) + ',' + y(boundary[3][1]) + 
                        'Z';
                }) 
                .style('fill', d => d.meta().color)
                .style('opacity', 0.5);
    
    dayDurationInPx = timeX(new Date(1970, 0, 2)) - timeX(new Date(1970, 0, 1));
    timelineSnapshotG
        .selectAll('circle')
        .data(data)
        .enter()
        .append('rect')
            .attr('x', d => timeX(utils.getNiceDate(d.data.timestamp)))
            .attr('y', () => height - 2 * padding.h - 6)
            .attr('height', 12)
            .attr('width', dayDurationInPx);
}

export { chart as default };
