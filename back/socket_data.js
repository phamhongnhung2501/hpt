var io = require("socket.io").listen(5002); // This is the Server for SERVER 1
var main_server = require("socket.io-client")('http://localhost:8001'); // This is a client connecting to the SERVER 2

let fault = ["00000000","01000000","00100000","00010000","00001000","00000100","00000010","00000001"];
let sub_id = ["lang_1234", "hadong_1234","nct_1234","caugiay_1234"];

function substation() {
    let UA = Math.floor(Math.random() * (500 - 300) + 300);
    let UB = Math.floor(Math.random() * (500 - 300) + 300);
    let UC = Math.floor(Math.random() * (500 - 300) + 300);
    let IA = Math.floor(Math.random() * 1000);
    let IB = Math.floor(Math.random() * 1000);
    let IC = Math.floor(Math.random() * 1000);
    let cosA = Math.random().toFixed(2);
    let cosB = Math.random().toFixed(2);
    let cosC = Math.random().toFixed(2);
    let fault_id = fault[Math.floor(Math.random() * sub_id.length)];
    let id = "tinas";
    return{
        id: id,
        UA: UA, UB: UB, UC: UC,
        IA: IA, IB: IB, IC: IC,
        cosA: cosA, cosB: cosB, cosC: cosC,
        PA: Math.floor(UA*IA*cosA), PB: Math.floor(UB*IB*cosB), PC: Math.floor(UC*IC*cosC),
        Pgiao: Math.floor(UA*IB*cosC),
        QA: Math.floor(UA*IA*Math.sqrt(1-cosA*cosA)),
        QB: Math.floor(UB*IB*Math.sqrt(1-cosB*cosB)),
        QC: Math.floor(UC*IC*Math.sqrt(1-cosC*cosC)),
        Freq: 50,
        Oil: Math.floor(Math.random() * 200),
        Humi: Math.floor(Math.random() * 500),
        Temp: Math.floor(Math.random() * 1000),
        Fault: fault_id,
        time: Date.now()
    }
}
console.log("Start send data")
main_server.on("connect",function(){
    main_server.on('health_DD:8E:AD:87:C0:0D',function(data){
        console.log(data)
    });
    // setInterval(function(){
    //     let data = substation();
    //     console.log(data.id, data.Fault);
    //     main_server.emit('substation',data);
    // },3000);
});

// io.on("connection",function(socket){
//     console.log("User-Client Connected!");
//     socket.on("message",function(data){
//         console.log(data.message)
//         // main_server.emit("message",data);
//     });
//     socket.on("disconnect",function(data){
//         main_server.emit("message","UD,"+socket.id);
//     });
// });