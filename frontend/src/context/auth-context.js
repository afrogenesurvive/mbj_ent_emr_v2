import React from 'react';

export default React.createContext({
    token: null,
    activityId: null,
    activityA: null,
    activityUser: null,
    role: null,
    userId: null,
    user: {},
    users:[],
    selectedUser: null,
    selectedPatient: null,
    selectedAppointment: null,
    selectedVisit: null,
    userAlert: "...",
    file: null,
    fancyDate: null,
    login: (token, activityId, role, tokenExpiration) => {},
    logout: () => {},
    setUserAlert: (args) => {},
    userOnline: () => {},
});
