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
        this.actions().map(action => action.executable(state[action.path]));
        return this;

    }


    _modelToGraphics (x, boundaryFn) {
        let rootGraphics, 
            nestedGraphics,
            graphics,
            y = this._dependencies.y;

        rootGraphics = this._group 
            .selectAll('.hf-atomic-flow-g')
            .data(this._data);

        nestedGraphics = rootGraphics
            .enter()
            .append('g')
                .attr('class', 'hf-atomic-flow-g')
            .merge(rootGraphics)
                .selectAll('path')
                .data(d => d);

        graphics = nestedGraphics 
            .enter()
            .append('path')
                .style('opacity', 0.5)
            .merge(nestedGraphics);

        graphics
            .transition(this._dependencies.transition)
            .attr('d', d => {
                let boundary = boundaryFn(d);
                return 'M' + x(boundary[0][0]) + ',' + y(boundary[0][1]) + 
                    'L' + x(boundary[1][0]) + ',' + y(boundary[1][1] - 1) + 
                    'L' + x(boundary[2][0]) + ',' + y(boundary[2][1] - 1) +  
                    'L' + x(boundary[3][0]) + ',' + y(boundary[3][1]) + 
                    'Z';
            });

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
                        this._graphics = this._modelToGraphics(this._dependencies.x, d => d.boundary(true));
                        break;

                    case 'TIME_X':
                    default:
                        this._graphics = this._modelToGraphics(this._dependencies.timeX, d => d.boundary());
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
                                .style('fill', d => d.meta().color);
                        break;

                    case 'LATEST_COMMIT_VIEW':
                    default:
                        this._graphics
                            .transition(this._dependencies.transition)
                            .style('fill', d => color(d.meta().color).fade(0.9));
                        break;
                    }
                }
            }
        ];
    }
};

export { EdgePresentation as default };
