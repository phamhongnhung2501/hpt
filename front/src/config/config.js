const config_network = {
    // "host": "http://uy-private-server.tinasoft.com.vn", 
     "host": "http://iot-demo.tinasoft.com.vn",
    "port": "9001"
};
const config_socket = {
    "ip": "http://iot-demo.tinasoft.com.vn: 9001",
};

const api_path = config_network.host + ':' + config_network.port + "/api/v1/";

const config_api = {
    "path": api_path,
    // Auth
    "signin": api_path + "auth",
    "register": api_path + "auth/register",
    "verify": api_path + "auth/verify",
    // project
    "project": api_path + "miband",
    // list seeds
    "seed": api_path + "seeds",
    // Getdata
    "data": api_path + "data",
    // Admin
    "admin": api_path + "users",
    // Notification
    "notification": api_path + "web-notifications",
};

module.exports = {
    config_network: config_network,
    config_api: config_api,
    config_socket: config_socket
};
