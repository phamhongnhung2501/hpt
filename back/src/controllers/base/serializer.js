const User = require('../user/models/users');
const network = require('../../../config/network');

async function convertOutput(object) {
    try {
        if (object.toObject) object = object.toObject({getters: true});
        if (object.photo) object.photo = getPhoto(object.photo);
        if (object.id) delete object.id;
        if (object.doctor) object.doctor = await getDoctorInfo(object.doctor);
        if (object.password) delete object.password;
        delete object.__v;
        return Object.entries(object).sort().reduce((obj, [k, v]) => ({...obj, [k]: v}), {});
    }catch (err) {
        throw err
    }
}

function getPhoto(img_path){
    let splited_path = img_path.split('\\');
    let photo_url = splited_path.slice(0, splited_path.length).join('/');
    return `http://${network.hostname}:${network.port}/static/${photo_url}`;
}

async function getDoctorInfo(user_id){
  try{
      let user = await User.findById(user_id, {full_name: 1, email: 1, phone_number: 1, photo:1, _id: 0});
      user.photo = getPhoto(user.photo);
      return user;
  }catch(err){
      throw err
  }
}

module.exports = {
  convertOutput
};