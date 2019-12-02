const formidable = require('formidable');
const fs = require('fs');
const lodash = require('lodash');
const path = require('path');

const User = require('./models/users');
const Information = require('../miband3/info/models/info');
const response = require('../base/response');
const serializer = require('../base/serializer');
let type_img = ["image/jpeg", "image/png"];

/** Get all users*/
async function listUser(req, res){
    try {
        let full_users = [];
        let users = await User.find({_id:{$ne:req.user._id}});
        for(let i=0;i<users.length;i++){
            full_users.push(await serializer.convertOutput(users[i]))
        }
        response.ok(res, full_users);
    } catch (err) {
        return response.notFound(res);
    }
}

/** Get your information*/
async function getMe(req, res){
    try {
        let user = await serializer.convertOutput(req.user);
        return response.ok(res, user);
    } catch (err) {
        return response.internal(res, err);
    }
}

/** Get user's information*/
async function getUser(req, res) {
    const user_id = req.params.userId;
    try {
        let user = await User.findById(user_id);
        if(!user) return response.notFound(res, "User doesn't exists!!!");
        let full_user = await serializer.convertOutput(user);
        return response.ok(res, full_user);
    }catch (err) {
        return response.internal(res, err);
    }
}

/** Edit your information*/
async function editUser(req, res) {
    let allow = ['full_name','gender','address','phone_number'];
    try {
        let object = Object.keys(req.body);
        for(let i=0;i<object.length;i++){
            if (!allow.includes(object[i])){
                return response.badData(res, 'You do not have permission to edit this profile');
            }
        }
        let user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
        let user_full = await serializer.convertOutput(user);
        console.log(user_full)
        return response.ok(res, user_full);
    } catch (err) {
        response.internal(res, err);
    }
}

/** Delete your user or not admin*/
async function deleteUser(req, res){
    try {
        let user = await User.findById(req.params.userId);
        if(!user) return response.notFound(res,"User doesn't exists!!!");
        if (user.is_admin) return response.forbidden(res, "Can't delete an admin user");
        if (req.user.is_admin || req.user._id.toString() === user._id.toString()) {
            await User.findByIdAndDelete(req.params.userId);
        }
        response.noContent(res)
    }catch (err) {
        response.internal(res, err);
    }
}

/** Change your password */
async function changePassword(req, res) {
    const { current_password, new_password } = req.body;
    try {
        let user = await User.findById(req.user._id);
        user.comparePassword(current_password, async (err, isMatch) => {
            if (!isMatch || err) return response.forbidden(res, "Wrong password.");
            user.password = new_password;
            await user.save();
            return response.noContent(res);
        });
    } catch (err) {
        response.internal(res, err);
    }
}

/** Change your avatar*/
function changeAvatar(req, res) {
    try{
        let url = path.join('.', 'static', 'media');
        let new_path;
        let form = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {
            let type = files.avatar.type;
            if(!type_img.includes(type)) return response.badData(res, "Type doesn't support!!!");
            let old_path = files.avatar.path;
            fs.existsSync(url) || fs.mkdirSync(url);
            new_path = path.join(url, files.avatar.name);
            fs.renameSync(old_path, new_path);
            new_path = new_path.slice(7);
            let user = await User.findByIdAndUpdate(req.user._id,{photo: new_path},{new:true});
            let full_user = await serializer.convertOutput(user);
            return response.ok(res, full_user);
        });
    }catch (err) {
        console.log(err);
        response.internal(res, err)
    }
}

/** Change user to admin user*/
async function changeAdmin(req, res){
    if(!req.user.is_admin) return response.forbidden(res,"Permission Denied!!!");
    let user = await User.findById(req.params.userId);
    if(!user) return response.notFound(res, "User doesn't exist!!!");
    if(user.is_admin === true) return response.badData(res, "User is already an admin user!!!");
    let devices = await Information.find({},{mac:1,_id:0});
    let sub = [];
    for(let i=0;i<devices.length;i++){
        sub.push(devices[i].mac)
    }
    let compare = lodash.difference(sub, user.devices);
    user.is_admin = req.body.is_admin;
    await User.findOneAndUpdate({_id:req.params.userId},{is_admin: true},{new:true});
    for(let i=0;i<compare.length;i++){
        user.devices.push(compare[i]);
        await User.findOneAndUpdate({_id:req.params.userId},{ $push: {"devices": compare[i]}},{new:true});
    }
    let full_user = await serializer.convertOutput(user);
    return response.ok(res, full_user);
}

module.exports = {
    listUser,
    getMe,
    getUser,
    editUser,
    changePassword,
    changeAvatar,
    changeAdmin,
    deleteUser
};