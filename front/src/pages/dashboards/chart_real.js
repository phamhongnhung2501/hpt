import React from "react";
import socketIOClient from "socket.io-client";
import ApexCharts from 'apexcharts';
import ReactApexChart from "react-apexcharts";
const utils = require("../../utils/utils");


var lastDate = 0;
var data = []
var TICKINTERVAL = 36000000
let XAXISRANGE = 86400000

function getNewSeries(baseval, yrange) {
    var newDate = baseval + TICKINTERVAL;
    lastDate = newDate

    for(let i = 0; i< data.length - 3; i++) {
        data[i].x = newDate - XAXISRANGE - TICKINTERVAL;
        data[i].y = 0
    }
    data.push({
        x: newDate,
        y: yrange
    })
}

class LineChart extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            options: {
                chart: {
                    id: 'realtime',
                    animations: {
                        enabled: true,
                        easing: 'linear',
                        dynamicAnimation: {
                            speed: 1000
                        }
                    },
                    toolbar: {
                        show: false
                    },
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth'
                },

                title: {
                    text: 'Dynamic Updating Chart',
                    align: 'left'
                },
                markers: {
                    size: 0
                },
                xaxis: {
                    type: 'datetime',
                    range: XAXISRANGE,
                },
                // yaxis: {
                //   max: 100,
                //   min: 50
                // },
                legend: {
                    show: false
                }
            },
            series: [{
                data: data.slice()
            }],
        }
    }

    componentDidMount() {
        const that = this;
        const mac = utils.getStationInfo().mac;
        const socket = socketIOClient('http://localhost:8001', {});
        socket.on("health_" + mac, function (value) {
            console.log(lastDate, value.time)
            getNewSeries(lastDate, value.heartbeat);

            ApexCharts.exec('realtime', 'updateSeries', [{
                data: data
            }])
        });
    }
    render() {
        return (
            <div id="chart">
                <ReactApexChart
                    options={this.state.options}
                    series={this.state.series}
                    type="line"
                    height="500"
                    width ="800"
                />
            </div>
        );
    }
}
export default LineChart;