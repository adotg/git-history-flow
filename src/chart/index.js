const d3 = require('./renderer');

function chart (conf, data, edges) {
    let chartSVG,
        rootG,
        historyFlowG,
        timelineG,
        axisLinesG,
        yAxisLinesG,
        xAxisLinesG,
        snapshotG,
        flowG,
        height,
        width,
        x,
        y,
        yMax,
        effectiveHeight,
        padding;
    
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
   
    // To bypass the lint error for not using the variable
    timelineG.attr();

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
        .range([0, effectiveHeight = height - 2 * padding.w]);

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
        .data(Array(yMax + 1).fill(1).map((d, i) => i))
        .enter()
        .append('path')
            .attr('d', (d) => { 
                let yVal = y(d);
                return 'M0,' + yVal + 'L' + (width - 2 * padding.w) + ',' + yVal;
            });

    // For testing ----------
    axisLinesG
        .append('g')
        .selectAll('text')
        .data(Array(yMax + 1).fill(1).map((d, i) => i))
        .enter()
        .append('text')
            .text(d => d ? d : '')
            .attr('x', -25)
            .attr('y', d => y(d))
            .attr('dy', '-0.35em');
    // ------------- Till this

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
}

export { chart as default };
