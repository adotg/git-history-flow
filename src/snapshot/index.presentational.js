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
            graphics,
            y = this._dependencies.y;

        rootGraphics = this._group 
            .selectAll('.hf-atomic-snapshot-g')
            .data(this._data);


        nestedGraphics = rootGraphics
            .enter()
            .append('g')
                .attr('class', 'hf-atomic-snapshot-g')
            .merge(rootGraphics)
                .selectAll('rect')
                .data((d, i) => 
                    d.hunks.map(hunk => 
                        ({ hunk: hunk, groupIndex: i, parentData: d })));

        graphics = nestedGraphics 
                .enter()
                .append('rect')
                    .attr('y', d => d._plotYStartPos = y(d.hunk.range[0] - 1)) 
                    .attr('width', 0.5) 
                    .attr('height', d => y(d.hunk.range[1]) - d._plotYStartPos)
                    .style('opacity', 0.0)
                .merge(nestedGraphics);

        graphics
            .transition(this._dependencies.transition)
            .attr('x', d => d._plotXStartPos = x(xValFn(d, d.parentData)));

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
                        this._graphics
                                .transition(this._dependencies.transition)
                                .style('fill', d => d.hunk.meta.color)
                                .style('opacity', 0.0);
                        break;

                    case 'LATEST_COMMIT_VIEW':
                    default:
                        this._graphics
                                .transition(this._dependencies.transition)
                                .attr('width', d => {
                                    if (d.hunk.recent) {
                                        return 2;
                                    } else {
                                        return 0.5;
                                    }
                                })
                                .style('fill', d => {
                                    if (d.hunk.recent) {
                                        return d.hunk.meta.color;
                                    } else {
                                        return color(d.hunk.meta.color).fade(0.9);
                                    }
                                })
                                .style('opacity', 1.0);
                        break;
                    }
                }
            }
        ];
    }
};

export { SnapshotPresentation as default };
