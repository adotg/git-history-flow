import { default as color } from 'color';

const EdgePresentation = class {
    constructor  () {
        this._graphics = null;
        this._group = null;
        this._dependencies = null;
        this._data = null;
    }
    
    setData (data) {
        this._data = data;
        return this;
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
            .selectAll('.hf-atomic-flow-g')
            .data(this._data)
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
                    .style('opacity', 0.5);
        
        this.action(state);

        return this;
    }

    action (state) {
        switch(state.mode) {
        case 'COMMUNITY_VIEW':
            this._graphics
                    .transition().duration(1000) 
                    .style('fill', d => d.meta().color);
            break;

        case 'LATEST_COMMIT_VIEW':
        default:
            this._graphics
                    .transition().duration(1000) 
                    .style('fill', d => color(d.meta().color).desaturate(0.8));
            break;
        }
        return this;
    }
};

export { EdgePresentation as default };
