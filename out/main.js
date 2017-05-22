(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("GitHistoryFlow", [], factory);
	else if(typeof exports === 'object')
		exports["GitHistoryFlow"] = factory();
	else
		root["GitHistoryFlow"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 535);
/******/ })
/************************************************************************/
/******/ ({

/***/ 199:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function (win) {
    var api,
        axisType,
        mode,
        watcher,
        populateContributors,
        doc = win.document;

    function editCls(elm, clsName, ops) {
        var newList,
            clsList = elm.getAttribute('class'),
            arr = clsList.split(/\s+/),
            found = arr.reduce(function (cache, item) {
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
                    newList = arr.filter(function (item) {
                        return item !== clsName;
                    }).join(' ');
                    elm.setAttribute('class', newList);
                }
                break;
        }

        return elm;
    }

    api = win.GitHistoryFlow.render({
        mountPoint: doc.getElementById('viz-container')
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

    populateContributors = function populateContributors(mode) {
        var contributorBase,
            key,
            hbSrc,
            hbTemplate,
            genHtml,
            contributorBaseArr = [];

        contributorBase = api.snapshots.reduce(function (store, item) {
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

        contributorBaseArr = contributorBaseArr.sort(function (m, n) {
            return n.count - m.count;
        });

        hbSrc = doc.getElementById('contributor-template').innerHTML;
        hbTemplate = win.Handlebars.compile(hbSrc);
        genHtml = hbTemplate({ contributor: contributorBaseArr, count: contributorBaseArr.length,
            commits: api.snapshots.length });
        doc.getElementById('contributor-mount').innerHTML = genHtml;
    };

    populateContributors('COMMUNITY_VIEW');
    watcher = api.watch(api.store.getState, 'mode');
    api.store.subscribe(watcher(function (newVal, oldVal) {
        if (oldVal === newVal) {
            return;
        }
        populateContributors(newVal);
    }));

    watcher = api.watch(api.store.getState, 'focus');
    api.store.subscribe(watcher(function (newVal, oldVal) {
        var snapshot = void 0,
            hbSrc = void 0,
            hbTemplate = void 0,
            genHtml = void 0,
            data = void 0,
            changes = void 0,
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
        context.user = data.user;
        changes = data.diff.changes.reduce(function (store, status) {
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
    api.store.subscribe(watcher(function (newVal, oldVal) {
        if (oldVal === newVal) {
            return;
        }
        populateContributors(newVal);
    }));
})(window);

/***/ }),

/***/ 535:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(199);


/***/ })

/******/ });
});