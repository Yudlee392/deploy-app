const { mutipleMongooseToObjects } = require("../../util/mongoose");
const Faculty = require("../models/Faculty");


class FacultyController {
    async createFacultyForm(req, res) {
        res.render('faculty/create');
    }

    //[POST] /admin/faculty/create
    async createFaculty(req, res, next) {

            const { name, description } = req.body;
            const newFaculty = new Faculty({ name, description });
            newFaculty.save();
            res.redirect ('./view');
    }

    //[GET] /admin/faculty/view
    async viewFaculties(req, res, next) {
        try {
            const faculties = await Faculty.find({});
            res.render('faculty/view', {
                faculties: mutipleMongooseToObjects(faculties),
                authen: true
            });
        } catch (error) {
            next(error);
        }
    }
    
    //[POST] /admin/faculties/:id/delete
    async deleteFaculty(req, res, next) {
        try {
            await Faculty.deleteOne({ _id: req.params.id });
            res.redirect('../view');
        } catch (error) {
            next(error);
        }
    }

    //[GET] /admin/faculties/:id/edit
    async editFaculty(req, res, next) {
        try {
            const faculty = await Faculty.findById(req.params.id);
            res.render('faculty/edit', {
                faculty: mutipleMongooseToObjects(faculty)
            });
        } catch (error) {
            next(error);
        }
    }
    
    //[POST] /admin/faculties/:id/update
    async updateFaculty(req, res, next) {
        try {
            const { name, description } = req.body;
            await Faculty.updateOne({ _id: req.params.id }, { name, description });
            res.redirect('../view'); 
        } catch (error) {
            next(error);
        }
    }
    
    
}

module.exports = new FacultyController();