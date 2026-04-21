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

        updateMilestone: "/progress/milestone",
        removeMilestone: "/progress/milestone/remove",
    },

    form: {
        formPagination: "/form/pagination",
        getOneForm: "/form",
        updateForm: "/form",
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
    }
}

export default apiPath