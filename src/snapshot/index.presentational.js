import { default as color } from 'color';

const SnapshotPresentation = class {
    constructor  () {
        this._model = null;
        this._graphics = null;
        this._group = null;
        this._dependencies = null;
        this._data = null;
    }

    render (group, state, depencencies) {
        this._group = group;
        this._dependencies = depencencies;

        this._draw(state);
    }

    setData (data) {
        this._data = data;
        return this;
    }

    _draw (state) {
        this.actions().map(action => action.executable(state[action.path]));
        return this;
    }

    _modelToGraphics (x, xValFn) {
        let rootGraphics, 
            nestedGraphics,
            axislineGraphics,
            nestedAxisLineGraphics,
            graphics = [],
            y = this._dependencies.y;

        rootGraphics = this._group 
            .selectAll('.hf-atomic-snapshot-g')
            .data(this._data);

        axislineGraphics = this._group 
            .selectAll('.hf-axisline-g')
            .data([this._data]);
            
        nestedAxisLineGraphics = axislineGraphics
            .enter()
            .append('g')
                .attr('class', 'hf-axisline-g')
            .merge(axislineGraphics)
                .selectAll('rect')
                .data(d => 
                    d.map((datum, i) => 
                        ({ groupIndex: i, parentData: datum })));

        graphics.push(nestedAxisLineGraphics
                .enter()
                .append('rect')
                    .attr('y', 0) 
                    .attr('height', y(this._dependencies.yMax)) 
                    .attr('width', 0.5) 
                .merge(nestedAxisLineGraphics));

        nestedGraphics = rootGraphics
            .enter()
            .append('g')
                .attr('class', 'hf-atomic-snapshot-g')
            .merge(rootGraphics)
                .selectAll('rect')
                .data((d, i) => 
                    d.hunks.map(hunk => 
                        ({ hunk: hunk, groupIndex: i, parentData: d })));

        graphics.push(nestedGraphics 
                .enter()
                .append('rect')
                    .attr('y', d => d._plotYStartPos = y(d.hunk.range[0] - 1)) 
                    .attr('height', d => y(d.hunk.range[1]) - d._plotYStartPos)
                .merge(nestedGraphics)
                    .attr('width', d => d.__width = d.__width || 0.5));

        graphics.map(graph => graph
            .attr('x', d => d._plotXStartPos = x(xValFn(d, d.parentData))));

        return graphics;
    }

    actions () {
        return [
            {
                path: 'xType',
                executable: (newVal, oldVal) => {
                    if (newVal === oldVal) {
                        return;
                    }

                    switch(newVal) {
                    case 'ORDINAL_X':
                        this._graphics = this._modelToGraphics(this._dependencies.x, datum => datum.groupIndex);
                        break;

                    case 'TIME_X':
                    default:
                        this._graphics = this._modelToGraphics(this._dependencies.timeX, (datum, d) => d.data.timestamp);
                        break;
                    }
                }
            },
            {
                path: 'mode',
                executable: (newVal, oldVal) => {
                    if (newVal === oldVal) {
                        return;
                    }

                    switch(newVal) {
                    case 'COMMUNITY_VIEW':
                        this._group.select('hf-axisline-g')
                                .style('opacity', 1.0);

                        this._group.select('hf-atomic-snapshot-g')
                                .style('opacity', 1.0);

                        this._graphics[1]
                                .attr('width', 0.5)
                                .style('fill', d => d.hunk.meta.color);
                        break;

                    case 'LATEST_COMMIT_VIEW':
                    default:
                        this._group.select('hf-axisline-g')
                                .style('opacity', 0.5);

                        this._graphics[1]
                                .attr('width', d => {
                                    if (d.hunk.recent) {
                                        return 2;
                                    } else {
                                        return null;
                                    }
                                })
                                .style('fill', d => {
                                    if (d.hunk.recent) {
                                        return d.hunk.meta.color;
                                    } else {
                                        return color(d.hunk.meta.color).fade(0.9);
                                    }
                                });
                        break;
                    }
                }
            },
            {
                path: 'focus',
                executable: (newVal, oldVal) => {
                    let focusMocker,
                        nestedMocker,
                        y,
                        tx,
                        data= [];

                    if (newVal === oldVal) {
                        return;
                    }

                    focusMocker = this._dependencies.focusMocker;
                    y = this._dependencies.y;
                    if (newVal === null || !isFinite(newVal)) {
                        focusMocker.attr('transform', 'translate(' + -9999 + ',0)');
                        return;
                    }

                    this._graphics[1]
                        .each(function (d) {
                            if (d.groupIndex === newVal) {
                                tx = d._plotXStartPos;
                                data.push(d);
                            }
                        });

                    nestedMocker = focusMocker
                        .selectAll('rect')
                        .data(data);
                    nestedMocker
                        .exit()
                            .remove();
                    nestedMocker
                        .enter()
                        .append('rect')
                            .attr('x', 0)
                            .attr('width', 5)
                        .merge(nestedMocker)
                            .attr('y', d => d._plotYStartPos = y(d.hunk.range[0] - 1))
                            .attr('height', d => y(d.hunk.range[1]) - d._plotYStartPos)
                            .style('fill', d => {
                                if (this._dependencies.store.getState().mode === 'COMMUNITY_VIEW') {
                                    return d.hunk.meta.color;
                                } else {
                                    if (d.hunk.recent) {
                                        return d.hunk.meta.color;
                                    } else {
                                        return color(d.hunk.meta.color).fade(0.9);
                                    }
                                }
                            });
                    focusMocker.attr('transform', 'translate(' + tx  + ',0)');
                    data.length = 0;
                }
            }
        ];
    }
};

export { SnapshotPresentation as default };
