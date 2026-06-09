const apiPath = {
    auth: {
        signUp: "/auth/signup",
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        authUser: "/auth/me",
        requireResetPassword: "/auth/password/require-reset",
        resetPassword: "/auth/password/update",
    },

    class: {
        getAllClasses: "/classes/all",
        getOneClass: "/classes/one",
        removeClass: "/classes",
        getMembers: "/classes/members",
        updateMember: "/classes/member/update",
        createNewClass: "/classes/new",
        updateClass: "/classes",
        joinClass: "/classes/join",
        removeMember: "/classes/member",
        getJoinForm: "/classes/join-form",
    },

    progress: {
        progressPagination: "/progress/pagination",
        getProgressDetail: "/progress",
        createNewProgress: "/progress/new",
        updateProgressInfo: "/progress/update",
        removeProgress: "/progress/remove",

        milestonePagination: "/progress/milestone/pagination",
        getOneMilestone: "/progress/milestone",
        updateMilestone: "/progress/milestone",
        removeMilestone: "/progress/milestone/remove",
        createRegistrationMilestone: "/progress/milestone/registration",
    },

    form: {
        formPagination: "/form/pagination",
        getOneForm: "/form",
        updateForm: "/form",
        toggleStop: "/form/toggle-stop",
        removeForms: "/form/remove",
        removeFields: "/form/field/remove",
    },

    scoreform: {
        scoreFormPagination: "/scoreforms",
        getScoreFormDetail: "/scoreforms/detail",
        getScoreFormRows: "/scoreforms/rows",
        updateScoreForm: "/scoreforms",
        softDeleteScoreForms: "/scoreforms/soft",
        hardDeleteScoreForms: "/scoreforms/hard",
        updateCell: "/scoreforms/cell",
        toggleStop: "/scoreforms/toggle-stop",
        approve: "/scoreforms/approve",
    },

    submission: {
        uploadFile: "/submission/upload-file",
        removeFile: "/submission/remove-file",
        getSubmissionPagination: "/submission/pagination",
        getOneSubmission: "/submission",
        updateSubmission: "/submission",
        updateStatus: "/submission/status",
    },

    admin: {
        getUsers: "/admin/users/pagination",
        getOneUser: "/admin/user",
        updateUser: "/admin/user/update",
    },

    public: {
        getTheses: "/public/theses",
    },

    topics: {
        getTopics: "/topics",
        getOneTopic: "/topics",
        myTopics: "/topics/my",
        createTopic: "/topics",
        inviteSupervisor: "/topics",   // PATCH /topics/:id/invite
        cancelInvite: "/topics",       // PATCH /topics/:id/cancel-invite
        supervisorResponse: "/topics", // PATCH /topics/:id/supervisor-response
        submitOutline: "/topics",      // PATCH /topics/:id/submit-outline
        reviewTopic: "/topics",        // PATCH /topics/:id/review
    },

    notifications: {
        getPagination: "/notifications",        // GET /notifications?...
        getOne: "/notifications",               // GET /notifications/:id
        upsert: "/notifications/update",        // POST /notifications/update
        remove: "/notifications",               // DELETE /notifications/:id
    },

    committee: {
        upsert: "/committees",
        getByClassId: (classId: string) => `/committees/${classId}`,
    }
}

export default apiPath