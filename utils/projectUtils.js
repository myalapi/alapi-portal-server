const mongoose = require('mongoose');
const Project = mongoose.model('Project');


async function updateProject(projectId, data, user){
    if (user.projects[projectId] != undefined) {
        Project.findById(projectId).then((project) => {
            if (project != undefined) {
                project[data.type] = data.data;
                project.save().then(() => {
                    return project;
                }).catch((error) => {
                    throw new Error(error.message);
                });
            } else {
                throw new Error("Project Not Found");
            }
        }).catch((error) => {
            throw new Error("Unable to Connect to DB");
        })
    }
}

module.exports.updateProject=updateProject;