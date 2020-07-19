import React from 'react';

export default React.createContext({
    token: null,
    activityId: null,
    activityA: null,
    activityB: null,
    activityC: null,
    role: null,
    userId: null,
    user: {},
    users:[],
    selectedUser: {},
    lesson: {},
    lessons: [],
    selectedLesson: null,
    selectedPerk: null,
    selectedPromo: null,
    selectedReview: null,
    sender: null,
    receiver: null,
    userAlert: "...",
    file: null,
    fancyDate: null,
    login: (token, activityId, role, tokenExpiration) => {},
    logout: () => {}
});
