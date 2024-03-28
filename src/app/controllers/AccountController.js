const { mutipleMongooseToObjects, mongoseToObject } = require("../../util/mongoose");
const Faculty = require("../models/Faculty");
const Role = require("../models/Role");
const User = require("../models/User");


class AccountController {
    async createAccountForm(req, res) {
        try {
            const roles = await Role.find();
            const faculties = await Faculty.find(); // Assuming Facility model is imported
            res.render('account/create', {
                roles: mutipleMongooseToObjects(roles),
                faculties: mutipleMongooseToObjects(faculties),
                authen: true
            });
        } catch (error) {
            next(error);
        }
    }

    //[POST] /admin/account/create
    async createAccount(req, res, next) {

        const { userName, password, roleId, email, fullName, facultyId } = req.body;
        const newAccount = new User({ userName, password, roleId, fullName, facultyId, email });
        // console.log('aaaa',newAccount)
        newAccount.save();
        res.redirect('/');
    }

    //[GET] /admin/account/view
    async viewUsers(req, res, next) {
        try {
            const users = await User.find({}).populate('roleId').populate('facultyId');
            res.render('account/view', {
                users: mutipleMongooseToObjects(users),
                authen: true
            });
        } catch (error) {
            next(error);
        }
    }

    //[POST] /admin/account/:id/delete
    async deleteAccount(req, res, next) {
        try {
            await User.deleteOne({ _id: req.params.id });
            res.redirect('../view');
        } catch (error) {
            next(error);
        }
    }

    //[GET] /admin/account/:id/edit
    async editAccount(req, res, next) {

        const roles = await Role.find();
        const faculties = await Faculty.find(); // Assuming Facility model is imported
            
        User.findById(req.params.id)
            .then(user => res.render('account/edit', {
                user: mongoseToObject(user),
                roles: mutipleMongooseToObjects(roles),
                faculties: mutipleMongooseToObjects(faculties),
            }))
            .catch(error => next(error));
    }


    //[POST] /admin/account/:id/update
    async updateAccount(req, res, next) {
        try {
            const { userName, password, email, fullName, roleId, facultyId } = req.body;
            const accountId = req.params.id;
    
            // Assuming 'Account' is your model for user accounts
            const updatedAccount = await User.findByIdAndUpdate(accountId, {
                userName,
                password, 
                email,
                fullName,
                roleId,
                facultyId
            }, { new: true }); // To return the updated document
    
            if (!updatedAccount) {
                return res.status(404).json({ error: 'Account not found' });
            }
    
            res.redirect('../view');
        } catch (error) {
            next(error); 
        }
    }
    


}

module.exports = new AccountController();