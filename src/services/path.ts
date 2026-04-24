const apiPath = {
    auth: {
        signUp: "/auth/signup",
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        authUser: "/auth/me"
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
        getSubmission: "/form/submission",
        removeForms: "/form/remove",
        removeFields: "/form/field/remove",
    },

    scoreform: {
        scoreFormPagination: "/scoreforms",
        getScoreFormDetail: "/scoreforms/detail",
        updateScoreForm: "/scoreforms",
        softDeleteScoreForms: "/scoreforms/soft",
        hardDeleteScoreForms: "/scoreforms/hard",
    },

    admin: {
        getUsecase: "/admin/usecase",
        addUsecase: "/admin/usecase/add",
        removeUsecase: "/admin/usecase/remove",
        getPermission: "/admin/permission",
        updatePermission: "/admin/permission/update"
    },

    topics: {
        getTopics: "/topics",
        getOneTopic: "/topics",
        createTopic: "/topics",
        inviteSupervisor: "/topics",   // PATCH /topics/:id/invite
        supervisorResponse: "/topics", // PATCH /topics/:id/supervisor-response
        submitOutline: "/topics",      // PATCH /topics/:id/submit-outline
        reviewTopic: "/topics",        // PATCH /topics/:id/review
    },

    notifications: {
        getPagination: "/notifications",        // GET /notifications?...
        getOne: "/notifications",               // GET /notifications/:id
        upsert: "/notifications/update",        // POST /notifications/update
        remove: "/notifications",               // DELETE /notifications/:id
    }
}

export default apiPath