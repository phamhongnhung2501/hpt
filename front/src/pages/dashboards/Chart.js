import React, { Component } from 'react';
import CanvasJSReact from '../../assets/canvasjs.react';
import moment from 'moment';
import './Db.css';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const utils = require("../../utils/utils");

let dps =[];
let xVal = dps.length + 1;
let old_data = {};

class DynamicLineChart extends Component {
	constructor(props) {
    super(props);
    this.state = {
      data: []
    };
		// this.updateChart = this.updateChart.bind(this);
	}
  // updateChart(time, data){
  //   dps.push({label: time,y: data,x:xVal});
  //   console.log(dps)
  //   xVal++;
  //   if (dps.length >  9 ) {
  //       dps.shift();
  //   }
  //   this.chart.render();
  // }

  updateChart(){
    if(old_data.time!=this.props.data.time){
      let time = moment(this.props.data.time).format('HH:mm:ss')
      dps.push({label: time,y: this.props.data.heartbeat,x:xVal});
      xVal++;
      if (dps.length >  9 ) {
          dps.shift();
      }
      this.chart.render();
    }
  }
//   resizeCanvas() {
//     var canvs = document.getElementById("snow");
//     canvs.width = window.innerWidth*0.75;
//     canvs.height = window.innerHeight*0.75;
// }
	render() {
    if(old_data.time!=this.props.data.time){
      let time = moment(this.props.data.time).format('HH:mm:ss')
      dps.push({label: time,y: this.props.data.heartbeat,x:xVal});
      xVal++;
      if (dps.length >  9 ) {
          dps.shift();
      }
      old_data = this.props.data
      // this.chart.render();
    }
		const options = {
      animationEnabled: true,
      animationDuration: 1000,
      zoomEnabled: true,
      // width: 720,
      // height: 480,
			subtitles :[{
				text: "Heartbeat Chart"
      }],
      axisY:{
        interlacedColor: "#FEFDDF",
        gridColor: "orange",
        minimum: 40,
        maximum: 120,
      },
			data: [{
        indexLabel: "{y}",
        indexLabelPlacement: "outside",  
        indexLabelOrientation: "horizontal",
        type: "line",
        lineColor: "red",
        lineThickness: 2,
				dataPoints : dps
      }]
		}
		
		return (
		// <div className="{this.updateChart()} chart--size w-100 !important" onload="resizeCanvas();" >
    <div className="{this.updateChart()} chart--size w-100 !important">
      <CanvasJSChart 
        // width="100%" 
        // height="100%"
        // id="snow"
        options = {options} 
        onRef={ref => this.chart = ref}
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}

export default DynamicLineChart;