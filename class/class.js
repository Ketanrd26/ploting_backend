class UserModel {
  constructor(user) {
    this.username = user.username;
    this.password = user.password;
    this.role = user.role;
  }
}

class ProjectModel {
  constructor(project) {
    this.projectname = project.projectname;
    this.projectarea = project.projectarea;
    this.projectlocation = project.projectlocation;
  }
}

class PlotModel {
  constructor(plots) {
    this.plotdirection = this.plotdirection;
    this.plotarea = plots.plotarea;
    this.plotrate = plots.plotrate;
    this.plotamount = plots.plotamount;

  }
}

export { UserModel, ProjectModel, PlotModel };
