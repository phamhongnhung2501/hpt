const response = require('../../base/response');
const Data = require('./models/data');

async function getDeviceData(req, res){
    try{
        let info = await Data.find({}).limit(5).sort({$natural:-1});
        return response.ok(res, info);
    }catch(err){
        console.log(err);
        return response.internal(res, err)
    }
}

async function getDeviceDataById(req, res) {
    try{
        let results = [];
        if(!req.user.devices.includes(req.params.mac)) return response.forbidden(res, "Permission Denied!!!");
        let info = await Data.find({mac: req.params.mac}).limit(20).sort({$natural:-1}).lean();
        for(let i=0;i<info.length;i++){
            info[i].time = info[i].time.getTime();
            // delete info[i].time;
            results.push(info[i])
        }
        return response.ok(res, info);
    }catch(err){
        return response.internal(res, err)
    }
}

async function getDataByIdAndTime(req, res) {
    try{
        // if(req.user.substations.includes(req.params.sub_id)) return response.forbidden(res, "Permission Denied!!!");
        let time_start = new Date(req.body.start_date);
        let time_finish = new Date(req.body.end_date);
        let full_data=[];
        // console.log(time_start);
        // console.log(time_finish);
        let infos = await Data.find({sub_id: req.params.sub_id, time: {$gte: time_start, $lte: time_finish}}).lean();
        for(let i=0;i<infos.length;i++) {
            infos[i].time = infos[i].time.getTime();
            full_data.push(infos[i]);
        }
        return response.ok(res, full_data);
    }catch(err){
        return response.internal(res, err)
    }
}

module.exports={
    getDeviceData,
    getDeviceDataById,
    getDataByIdAndTime
};