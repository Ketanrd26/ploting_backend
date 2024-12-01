class UserModel {
    constructor(user){
        this.username = user.username;
        this.password = user.password;
        this.role = user.role
    }
}

class projectModel {
    constructor(project){

    }
}

export default {UserModel,projectModel};