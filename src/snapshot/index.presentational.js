import { default as color } from 'color';

const SnapshotPresentation = class {
    constructor  (semantical) {
        this.semantical = semantical;

        this._graphics = null;
        this._group = null;
        this._dependencies = null;
    }

    render (group, state, depencencies) {
        this._group = group;
        this._dependencies = depencencies;

        this._draw(state);
    }

    _draw (state) {
        let depencencies = this._dependencies, 
            x = depencencies.x,
            y = depencencies.y;

        this._graphics = this._group 
            .selectAll('.hf-atomic-snapshot-g')
            .data(this.semantical.getData())
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
                    .attr('height', d => y(d.hunk.range[1]) - d._plotYStartPos);
        
        this.action(state);

        return this;
    }

    action (state) {
        switch(state.mode) {
        case 'COMMUNITY_VIEW':
            this._graphics.style('fill', d => d.hunk.meta.color);
            break;

        case 'LATEST_COMMIT_VIEW':
        default:
            this._graphics.style('fill', d => {
                if (d.hunk.recent) {
                    return d.hunk.meta.color;
                } else {
                    return color(d.hunk.meta.color).darken(0.7);
                }
            });
            break;
        }
        return this;
    }
};

export { SnapshotPresentation as default };
