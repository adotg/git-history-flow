import { default as color } from 'color';

const EdgePresentation = class {
    constructor  () {
        this._model = null;
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
        this._model = this._group 
            .selectAll('.hf-atomic-flow-g')
            .data(this._data);

        this.action(state);
        return this;

    }


    _modelToGraphics (x, boundaryFn) {
        let rootGraphics, 
            y = this._dependencies.y;

        rootGraphics = this._model
            .enter()
            .append('g')
                .attr('class', 'hf-atomic-flow-g')
                .selectAll('path')
                .data(d => d)
                .enter()
                .append('path')
                    .style('opacity', 0.5)
                .merge(this._model)
                    .attr('d', d => {
                        let boundary = boundaryFn(d);

                        return 'M' + x(boundary[0][0]) + ',' + y(boundary[0][1]) + 
                            'L' + x(boundary[1][0]) + ',' + y(boundary[1][1] - 1) + 
                            'L' + x(boundary[2][0]) + ',' + y(boundary[2][1] - 1) +  
                            'L' + x(boundary[3][0]) + ',' + y(boundary[3][1]) + 
                            'Z';
                    });

        return rootGraphics;
    }

    action (state) {
        switch(state.xType) {
        case 'ORDINAL_X':
            this._graphics = this._modelToGraphics(this._dependencies.x, d => d.boundary(true));
            break;

        case 'TIME_X':
        default:
            this._graphics = this._modelToGraphics(this._dependencies.timeX, d => d.boundary());
            break;
        }

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
                    .style('fill', d => color(d.meta().color).fade(0.9));
            break;
        }
        return this;
    }
};

export { EdgePresentation as default };
