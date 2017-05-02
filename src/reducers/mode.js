const MODES_ENUM = {
        COMMUNITY_VIEW: 'COMMUNITY_VIEW',
        LATEST_COMMIT_VIEW: 'LATEST_COMMIT_VIEW',
        AGE_VIEW: 'AGE_VIEW'
    },
    mode = (state = MODES_ENUM.COMMUNITY_VIEW, action) => {
        switch (action.type) {
        case 'CHANGE_MODE':
            return action.payload.mode;
        
        default:
            return state;
        }
    };

export { mode as default };
