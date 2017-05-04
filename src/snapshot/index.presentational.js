import { default as color } from 'color';

const SnapshotPresentation = class {
    constructor  () {
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
        let depencencies = this._dependencies, 
            x = depencencies.x,
            y = depencencies.y;

        this._graphics = this._group 
            .selectAll('.hf-atomic-snapshot-g')
            .data(this._data)
            .enter()
            .append('g')
                .attr('class', 'hf-atomic-snapshot-g')
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
                    .style('opacity', 0.0);
        
        this.action(state);

        return this;
    }

    action (state) {
        switch(state.mode) {
        case 'COMMUNITY_VIEW':
            this._graphics
                    .transition().duration(1000) 
                    .style('fill', d => d.hunk.meta.color)
                    .style('opacity', 1.0);
            break;

        case 'LATEST_COMMIT_VIEW':
        default:
            this._graphics
                    .transition().duration(1000) 
                    .style('fill', d => {
                        if (d.hunk.recent) {
                            return d.hunk.meta.color;
                        } else {
                            return color(d.hunk.meta.color).desaturate(0.8);
                        }
                    })
                    .style('opacity', 1.0);
            break;
        }
        return this;
    }
};

export { SnapshotPresentation as default };