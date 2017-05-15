(function (win) { 
    var api,
        spacingR,
        modeR,
        axisType,
        mode,
        doc = win.document,
        getByName = doc.getElementsByName,
        getById = doc.getElementById;

    function editCls (elm, clsName, ops) {
        var newList,
            clsList = elm.getAttribute('class')
            arr = clsList.split(/\s+/),
            found = arr.reduce((cache, item) => {
                if (cache) {
                    return cache;
                }
                return item === clsName;
            }, false);

        switch (ops) {
        case 'add':
            if (!found) {
                arr.push(clsName);
                newList = arr.join(' ');
                elm.setAttribute('class', newList);
            }
            break;

        case 'remove':
            if (found) {
                newList = arr.filter(item => item !== clsName).join(' ');
                elm.setAttribute('class', newList);
            }
            break;
        }

        return elm;
    }

    api = GitHistoryFlow.render({
        mountPoint: doc.getElementById('viz-container'),
    }, win.data);

    axisType = doc.getElementById('axis-type');
    axisType.addEventListener('click', function (e) {
        var target = e.target,
            val = target.getAttribute('_value_');

        Array.prototype.forEach.call(this.getElementsByTagName('button'), function (btn) {
            if (btn === target) {
                editCls(btn, 'active', 'add');
            } else {
                editCls(btn, 'active', 'remove');
            }
        });

        if (val === 'ordinal') {
            api.store.dispatch(api.all.changeXType('ORDINAL_X'));
        } else if (val === 'time') {
            api.store.dispatch(api.all.changeXType('TIME_X'));
        }

        mode.getElementsByTagName('button')[0].click();
        
    });


    mode = doc.getElementById('mode');
    mode.addEventListener('click', function (e) {
        var target = e.target,
            val = target.getAttribute('_value_');

        Array.prototype.forEach.call(this.getElementsByTagName('button'), function (btn) {
            if (btn === target) {
                editCls(btn, 'active', 'add');
            } else {
                editCls(btn, 'active', 'remove');
            }
        });
        
        if (val === 'community') {
            api.store.dispatch(api.all.changeMode('COMMUNITY_VIEW'));
        } else if (val === 'commit') {
            api.store.dispatch(api.all.changeMode('LATEST_COMMIT_VIEW'));
        }
    });
})(window);
