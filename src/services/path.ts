const apiPath = {
    auth: {
        signUp: "auth/signup",
        signIn: "auth/signin",
        signOut: "auth/signout",
        authUser: "auth/me"
    },

    class: {
        getAllClasses: "classes/all",
        getOneClasses: "classes/one",
        getMembers: "classes/one/members",
        createNewClass: "classes/new",
        updateClass: "classes",
        joinClass: "classes/join",
    },

    admin: {
        getUsecase: "admin/usecase",
        addUsecase: "admin/usecase/add",
        removeUsecase: "admin/usecase/remove",
        getPermission: "admin/permission",
        updatePermission: "admin/permission/update"
    }
}

export default apiPath