const { mutipleMongooseToObjects, mongoseToObject } = require("../../util/mongoose");
const Faculty = require("../models/Faculty");
const Role = require("../models/Role");
const User = require("../models/User");
const bcrypt = require("bcrypt");

class AccountController {
    async createAccountForm(req, res) {
        try {
            const roles = await Role.find();
            const faculties = await Faculty.find(); // Assuming Facility model is imported
            res.render('account/create', {
                roles: mutipleMongooseToObjects(roles),
                faculties: mutipleMongooseToObjects(faculties),
                authen: 'admin',
                activePage: 'account'
            });
        } catch (error) {
            next(error);
        }
    }

    //[POST] /admin/account/create
    async createAccount(req, res, next) {

        const { userName, password, roleId, email, fullName, facultyId } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAccount = new User({ userName, password: hashedPassword, roleId, fullName, facultyId, email });
        // console.log('aaaa',newAccount)
        newAccount.save();
        res.redirect('./view');
    }

    //[GET] /admin/account/view
    async viewUsers(req, res, next) {
        try {
            const roles = await Role.find();
            const roleAdmin= await Role.find({name:'admin'});
            const admins=await User.find({roleId:roleAdmin[0]._id}).populate('roleId').populate('facultyId');;
            const roleManagerr= await Role.find({name:'manager'});
            const managers=await User.find({roleId:roleManagerr[0]._id}).populate('roleId').populate('facultyId');;
            const roleStudent= await Role.find({name:'student'});
            const students=await User.find({roleId:roleStudent[0]._id}).populate('roleId').populate('facultyId');;
            const roleCoordinator= await Role.find({name:'coordinator'});
            const coordinators=await User.find({roleId:roleCoordinator[0]._id}).populate('roleId').populate('facultyId');;
            const faculties = await Faculty.find();
            const users = await User.find({}).populate('roleId').populate('facultyId');
            res.render('account/view', {
                users: mutipleMongooseToObjects(users),
                admins: mutipleMongooseToObjects(admins),
                managers: mutipleMongooseToObjects(managers),
                students: mutipleMongooseToObjects(students),
                coordinators: mutipleMongooseToObjects(coordinators),
                authen: 'admin',
                activePage: 'account',
                roles: mutipleMongooseToObjects(roles),
                faculties: mutipleMongooseToObjects(faculties),
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
            const hashedPassword = await bcrypt.hash(password, 10);
            const accountId = req.params.id;
    
            // Assuming 'Account' is your model for user accounts
            const updateObject = {
                userName,
                password:hashedPassword, 
                email,
                fullName,
                roleId
            };
            
            if (facultyId !== "") {
                updateObject.facultyId = facultyId;
            }
            
            const updatedAccount = await User.findByIdAndUpdate(accountId, updateObject, { new: true });
            
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