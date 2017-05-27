(function (win) { 
    var api,
        axisType,
        mode,
        watcher,
        populateContributors,
        doc = win.document;

    function editCls (elm, clsName, ops) {
        var newList,
            clsList = elm.getAttribute('class'),
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

    api = win.GitHistoryFlow.render({
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
            api.store.dispatch(api.actions.changeXType('ORDINAL_X'));
        } else if (val === 'time') {
            api.store.dispatch(api.actions.changeXType('TIME_X'));
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
            api.store.dispatch(api.actions.changeMode('COMMUNITY_VIEW'));
        } else if (val === 'commit') {
            api.store.dispatch(api.actions.changeMode('LATEST_COMMIT_VIEW'));
        }
    });

    populateContributors = (mode) => {
        var contributorBase,
            key,
            hbSrc,
            hbTemplate,
            genHtml,
            contributorBaseArr = [];
        
        contributorBase = api.snapshots.reduce((store, item) => {
            var user = item.data.user;

            if (user.email in store) {
                store[user.email].count++; 
            } else {
                store[user.email] = {
                    user: user,
                    count: 1,
                    color: mode === 'COMMUNITY_VIEW' ? item.data.flowColor : item.data.color
                };
            }

            return store;
        }, {});

        for (key in contributorBase) {
            contributorBaseArr.push(contributorBase[key]);
        }

        contributorBaseArr = contributorBaseArr.sort((m, n) => n.count - m.count);

        hbSrc = doc.getElementById('contributor-template').innerHTML;
        hbTemplate = win.Handlebars.compile(hbSrc);
        genHtml = hbTemplate({ contributor: contributorBaseArr, count: contributorBaseArr.length, 
            commits: api.snapshots.length });
        doc.getElementById('contributor-mount').innerHTML = genHtml;
    };

    populateContributors('COMMUNITY_VIEW');
    watcher = api.watch(api.store.getState, 'mode');
    api.store.subscribe(watcher((newVal, oldVal) => {
        if (oldVal === newVal) {
            return;
        }
        populateContributors(newVal);
    }));


    watcher = api.watch(api.store.getState, 'focus');
    api.store.subscribe(watcher((newVal, oldVal) => {
        let snapshot,
            hbSrc,
            hbTemplate,
            genHtml,
            data,
            changes,
            context = {};


        if (oldVal === newVal) {
            return;
        }
        
        if (newVal === null) {
            doc.getElementById('summary-mount').innerHTML = '';
            return;
        }
        
        snapshot = api.snapshots[newVal];
        data = snapshot.data;
        context.desc = data.desc;
        context.commitId = data.commitId;
        context.timestamp = data.timestamp;
        context.user= data.user;
        changes = data.diff.changes.reduce((store, status) => {
            store.add += status[3]; 
            store.del += status[1]; 

            return store;
        }, { add: 0, del: 0 });
        context.addition = changes.add + ' ++ ';
        context.deletion = changes.del + ' -- ';

        hbSrc = doc.getElementById('summary-template').innerHTML;
        hbTemplate = win.Handlebars.compile(hbSrc);
        genHtml = hbTemplate(context);
        doc.getElementById('summary-mount').innerHTML = genHtml;
    }));

    populateContributors('COMMUNITY_VIEW');
    watcher = api.watch(api.store.getState, 'mode');
    api.store.subscribe(watcher((newVal, oldVal) => {
        if (oldVal === newVal) {
            return;
        }
        populateContributors(newVal);
    }));

})(window);
