const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
let type_img = ["image/jpeg", "image/png"];

const response = require('../../base/response');
const Information = require('./models/info');
const User = require('../../user/models/users');
const serializer = require('../../base/serializer');
const lodash = require('lodash');

/** Get info of devices*/
async function getDevice(req, res) {
    try{
        let full_infos = [];
        let devices = req.user.devices;
        for(let i=0;i<devices.length;i++){
            let info = await Information.findOne({mac: devices[i]});
            if(info) full_infos.push(await serializer.convertOutput(info))
        }
        // console.log(full_infos)
        response.ok(res, full_infos);
    }catch(err){
        console.log(err)
        response.internal(res, err)
    }
}

/** Get information of device*/
async function getDeviceById(req, res) {
    try{
        let info = await Information.findOne({mac: req.params.mac});
        if(!info) return response.notFound(res, "Device doesn't exists!!!");
        if(!req.user.devices.includes(req.params.mac)) return response.forbidden(res, "Permission Denied!!!");
        let full_info = await serializer.convertOutput(info);
        return response.ok(res, full_info);
    }catch(err){
        return response.internal(res, err)
    }
}

/** Creat new device*/
async function newDevice(req, res) {
    try{
        if(!req.user.is_admin) return response.forbidden(res,"Permission Denied!!!");
        let check_device = await Information.findOne({mac: req.body.mac});
        if(check_device) return response.badRequest(res,"Device has been existed!!!");
        req.body.doctor = req.user._id;
        let new_device = await Information.create(req.body);
        await User.updateMany({is_admin:true},{ $push: {"devices": new_device.mac}});
        let full_info = await serializer.convertOutput(new_device);
        return response.created(res, full_info)
    }catch(err){
        return response.internal(res, err)
    }
}

/** Edit information of device*/
async function editDevice(req, res){
    let change_element = req.body;
    delete change_element.doctor;
    // console.log(change_element);
    try {
        if(!req.user.is_admin) return response.forbidden(res,"Permission Denied!!!");
        if(change_element.mac) delete change_element.mac;
        let device = await Information.findOneAndUpdate({mac:req.params.mac}, change_element, {new:true});
        let full_info = await serializer.convertOutput(device);
        response.ok(res, full_info)
    }catch (err) {
        response.internal(res, err)
    }
}

/** Follow a device*/
async function addDeviceToUser(req, res) {
    try{
        if(!req.user.is_admin) return response.forbidden(res,"Permission Denied!!!");
        // console.log(req.body)
        let check_user = await User.findById(req.body.user_id);
        if(!check_user) return response.notFound(res,"User doesn't exist!!!");

        if(check_user.devices.length > req.body.devices.length){
            let compare = lodash.difference(check_user.devices, req.body.devices);
            for(let i=0;i<compare.length;i++){
                let device = await Information.findOne({mac: compare[i]},{_id:1});
                if(!device) return response.notFound(res,"Device doesn't exist!!!");
                await User.findOneAndUpdate({_id:req.body.user_id},{ $pull: {"devices": compare[i]}},{new:true});
            }
        }
        else{
            let compare = lodash.difference(req.body.devices, check_user.devices);
            for(let i=0;i<compare.length;i++){
                let device = await Information.findOne({mac: compare[i]},{_id:1});
                if(!device) return response.notFound(res,"Device doesn't exist!!!");
                await User.findOneAndUpdate({_id:req.body.user_id},{ $push: {"devices": compare[i]}},{new:true});
            }
        }
        let user = await User.findById(req.body.user_id);
        return response.created(res, user)
    }catch(err){
        console.log(err);
        return response.internal(res, err)
    }
}

/** Delete device*/
async function deleteDevice(req, res){
    try {
        if (!req.user.is_admin) return response.forbidden("Permission Denied!!!");
        await Information.findOneAndDelete({mac:req.params.mac});
        // await User.updateMany({},{ $pull: {"devices": req.params.mac}});
        response.noContent(res)
    }catch (err) {
        response.internal(res, err);
    }
}

function changeLogo(req, res) {
    try{
        let url = path.join('.', 'static', 'logo');
        let new_path;
        let form = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {
            let type = files.logo.type;
            if(!type_img.includes(type)) return response.badData(res, "Type doesn't support!!!");
            let old_path = files.logo.path;
            fs.existsSync(url) || fs.mkdirSync(url);
            new_path = path.join(url, files.logo.name);
            fs.renameSync(old_path, new_path);
            new_path = new_path.slice(7);
            let device = await Information.findOneAndUpdate({mac: fields.mac},{photo: new_path},{new:true});
            console.log(device)
            let full_device = await serializer.convertOutput(device);
            return response.ok(res, full_device);
        });
    }catch (err) {
        console.log(err);
        response.internal(res, err)
    }
}

module.exports={
    getDevice,
    getDeviceById,
    newDevice,
    editDevice,
    addDeviceToUser,
    deleteDevice,
    changeLogo
};