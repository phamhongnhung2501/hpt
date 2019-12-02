const Data = require('../src/controllers/miband3/data/models/data');
const Information = require('../src/controllers/miband3/info/models/info');

async function saveData(object) {
    try {
        object.sub_id = object.id;
        let substation = await Information.findOne({sub_id: object.sub_id});
        if (!substation) console.log("Substation doesn't exist");
        else {
            await Data.create(object);
            console.log("Saved data on database.")
        }
    }catch (err) {
        throw err
    }
}

function fakeData(mac){
    return{
        heartbeat:  Math.floor(Math.random() * (90 - 65) + 65),
        steps: Math.floor(Math.random() * (8000 - 6000) + 6000),
        callories: Math.floor(Math.random() * (500 - 200) + 200),
        meters: Math.floor(Math.random() * (10 - 1) + 1),
        fat_gramms: Math.floor(Math.random() * (500 - 200) + 200),
        battery: 50,
        mac: mac,
        time: Date.now()
    }
}

async function getNewestData(mac){
    try{
        let data = await Data.findOne({mac: mac}).sort({$natural:-1}).lean();
        data.time = data.time.getTime();
        return data
    }catch(err){
        throw err
    }
}

module.exports ={
    saveData,
    fakeData,
    getNewestData
};