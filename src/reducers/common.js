const MODES_ENUM = {
        COMMUNITY_VIEW: 'COMMUNITY_VIEW',
        LATEST_COMMIT_VIEW: 'LATEST_COMMIT_VIEW',
        AGE_VIEW: 'AGE_VIEW'
    },
    X_TYPE_ENUM = {
        ORDINAL_X: 'ORDINAL_X',
        TIME_X: 'TIME_X'
    },
    mode = (state = MODES_ENUM.COMMUNITY_VIEW, action) => {
        switch (action.type) {
        case 'CHANGE_MODE':
            return action.payload.mode;
        
        default:
            return state;
        }
    },
    xType = (state = X_TYPE_ENUM.ORDINAL_X, action) => {
        switch (action.type) {
        case 'CHANGE_X':
            return action.payload.type;
        
        default:
            return state;
        }
    };

export { mode, xType };
