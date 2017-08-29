import { Injectable } from '@angular/core';

@Injectable()
export class ChartService {

  constructor() { }

  formatter_value(value, index) {
      if (value < 1000) {
          return value;
      } else {
          return value/1000;
      }
  }

  formatter_yaxis_name(metric) {
    return 'accuracy (%)';
  }

  getUTCTimeStamp(timestamp) {
    var TzOffset = new Date(timestamp).getTimezoneOffset()/60;
    return timestamp-TzOffset*60*60*1000;
    //timestamp-(new Date(timestamp).getTimezoneOffset()/60)*60*60*1000
  }

  getTooltip(params) {
    var result = '';
    if (params.length > 0) {
          result = new Date(this.getUTCTimeStamp(params[0].data[0])).toUTCString().replace('GMT', '')+
                      '<br /> Value : ' + params[0].data[1];
    }
    return result;
  }

  formatTimeStamp(timestamp) {
      var TzOffset = new Date(timestamp).getTimezoneOffset()/60-7;
      return timestamp+TzOffset*60*60*1000;
  }

  getMetricData(metric) {
    var data = [];
    var chartData = metric.details;
    for(var i = 0; i < chartData.length; i++){
         data.push([this.formatTimeStamp(chartData[i]._source.tmst), parseFloat((chartData[i]._source.matched/chartData[i]._source.total*100).toFixed(2))]);
           if(chartData[i]._source.total!=0)
             data.push([this.formatTimeStamp(chartData[i]._source.tmst), parseFloat((chartData[i]._source.matched/chartData[i]._source.total*100).toFixed(2))]);
           else
             data.push([this.formatTimeStamp(chartData[i]._source.tmst), parseFloat((0).toFixed(2))]);
      }

    data.sort(function(a, b){
      return a[0] - b[0];
    });

    return data;
  }

  getOptionSide(metric) {
    var data = this.getMetricData(metric);
    var option = {
      title: {
        show: false
      },
      backgroundColor: 'transparent',
      grid:{
        right: '5%',
        left: '5%',
        bottom: '5%',
        top: 30,
        containLabel: true

      },
      tooltip : {
          trigger: 'axis',
          formatter : function(params) {
            return new Date(this.getUTCTimeStamp(params[0].data[0])).toUTCString().replace('GMT', '')+
                      '<br /> Value : ' + params[0].data[1];;
          }
      },
      xAxis : {
              type : 'time',
              splitLine: {
                  show: false
              },
              splitNumber: 2
      },
      yAxis : {
              type : 'value',
              scale : true,
              name: this.formatter_yaxis_name(metric),
              axisLabel: {
                  formatter: this.formatter_value
              },
              splitNumber: 2
      },
      series:{}
    };
    option.series = this.getSeries(metric);
    return option;
  }

  getSeriesCount(metric) {
    var series = [];
    var data = this.getMetricData(metric);
    series.push({
          type: 'line',
          data: data,
          smooth:true,
          lineStyle: {
            normal: {
                color: '#d48265'
            }
          },
          itemStyle: {
              normal: {
                  color: '#d48265'
              }
          }
      });
      return series;
  }

  getSeries(metric) {
    var series = {};
    series = this.getSeriesCount(metric);
    return series;
  }

  getOptionThum(metric) {
    var data = this.getMetricData(metric);
    var option = {
      title: {
        text:  metric.name,
        left: 'center',
        textStyle: {
            fontWeight: 'normal',
            fontSize: 15
        }
      },
      backgroundColor: 'transparent',
      grid:{
        right: '7%',
        left: '5%',
        bottom: '5%',
        containLabel: true
      },
      tooltip : {
          trigger: 'axis',
          formatter : function(params) {
            return this.getTooltip(params);
          },
          position: function(point, params, dom) {
              return this.getTooltipPosition(point, params, dom);
          }
      },
      xAxis : {
      		  axisLine:{
      		  	lineStyle:{
      		  		color:'white'
      		  	}
      		  },
              type : 'time',
              splitLine: {
                  show: false
              },
              axisLabel:{
              	color:'white'
              },
              nameTextStyle:{
              	color:'white'
              },
              splitNumber: 2
      },
   
      yAxis : {
              type : 'value',
              scale : true,
              name: 'accuracy%',
              axisLabel: {
                  formatter: this.formatter_value,
                  color:'white'
              },
              splitLine:{
              	lineStyle:{
              		'type':'dashed'
              	}
              },
              axisLine:{
      		  	lineStyle:{
      		  		color:'white'
      		  	}
      		  },
              nameTextStyle:{
              	color:'white'
              },
              splitNumber: 2
      },
      series:{}
    };
    option.series = this.getSeries(metric);
    return option;
  }

  getOptionBig(metric) {
    var data = this.getMetricData(metric);
    var option = {
      title: {
        text:  metric.name,
        link: '/measure/' + metric.name,
        target: 'self',
        left: 'center',
        textStyle: {
            fontSize: 25,
            color:'white'
        }
      },
      grid: {
        right: '2%',
        left: '2%',
        containLabel: true
      },
      dataZoom: [{
        type: 'inside',
        start: 0,
        throttle: 50
      },{
        show: true,
        start: 0
      }],
      tooltip : {
          trigger: 'axis',
          formatter : function(params) {
            return new Date(params[0].data[0]-(new Date(params[0].data[0]).getTimezoneOffset()/60)*60*60*1000).toUTCString().replace('GMT', '')+
                      '<br /> Value : ' + params[0].data[1];
          }
      },
      xAxis : {
      		  axisLine:{
      		  	lineStyle:{
      		  		color:'white'
      		  	}
      		  },
              type : 'time',
              splitLine: {
                  show: false
              },
              axisLabel:{
              	color:'white'
              },
              nameTextStyle:{
              	color:'white'
              }
      },
      yAxis : {
              type : 'value',
              scale : true,
              splitLine:{
              	lineStyle:{
              		'type':'dashed'
              	}
              },
              name: 'accuracy%',
              axisLabel: {
                  formatter: null,
                  color:'white'
              },
              axisLine:{
      		  	lineStyle:{
      		  		color:'white'
      		  	}
      		  },
              nameTextStyle:{
              	color:'white'
              }
      },
      animation: true,
      series:{}
    };
    option.series = this.getSeries(metric);
    return option;
  }
}
