import { default as SmartLabelManager } from 'fusioncharts-smartlabel';
import { default as utils } from '../utils';

const TimelinePresentation = class {
    constructor  () {
        this._graphics = {};
        this._group = null;
        this._dependencies = null;
        this._data = null;

        this._smartlabel = (new SmartLabelManager(0))
            .setStyle({
                'font-size': '10px',
                'font-family': 'monospace'
            });
    }
    
    setData (data) {
        this._data = data;
        return this;
    }
    
    setPosition (pos) {
        this._pos = pos;
        return this;
    }

    render (group, state, depencencies) {
        this._group = group;
        this._dependencies = depencencies;

        this._draw(state);
    }

    _draw () {
        let pos = this._pos;
        this._drawText(pos.y);

        return this;
    }

    _drawText (y) {
        let xAxis = this._dependencies.x, 
            smartlabel = this._smartlabel,
            data = this._data, 
            group = this._graphics.textGroup = this._graphics.textGroup ||
                (this._group 
                    .append('g')
                    .attr('class', 'hf-timeline-text'));

        group
            .selectAll('text')
            .data(utils.niceDateTicks(data[0].data.timestamp, data[data.length - 1].data.timestamp))
            .enter('text')
            .append('text')
                .text(d => d)
                .attr('text-anchor', 'middle')
                .attr('x', (d, i) => {
                    let dim = smartlabel.getOriSize(d);
                    if (i) {
                        return xAxis(data.length - 1) - dim.width * 1 / 4; 
                    } else {
                        return xAxis(0) + dim.width * 1 / 4;
                    }
                })
                .attr('y', () => {
                    return y - smartlabel.getOriSize('W').height;
                })
                .style('font-family', 'monospace')
                .style('font-size', '10px');

        return this;
    }
};

export { TimelinePresentation as default };
