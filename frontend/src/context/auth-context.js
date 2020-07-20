import React from 'react';

export default React.createContext({
    token: null,
    activityId: null,
    activityA: null,
    role: null,
    userId: null,
    user: {},
    users:[],
    selectedUser: {},
    userAlert: "...",
    file: null,
    fancyDate: null,
    login: (token, activityId, role, tokenExpiration) => {},
    logout: () => {}
});
