import { Component, OnInit } from '@angular/core';
import  {HttpClient} from '@angular/common/http';
import  {Router} from "@angular/router";
import {ChartService} from '../service/chart.service';
import {GetMetricService} from '../service/get-metric.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-metric',
  templateUrl: './metric.component.html',
  styleUrls: ['./metric.component.css'],
  providers:[ChartService,GetMetricService]
})
export class MetricComponent implements OnInit {

  constructor(
  	public chartService:ChartService,
  	public getMetricService:GetMetricService,
  	private http: HttpClient,
  	private router:Router) { }
  orgs = [];
  finalData = [];
  originalOrgs = [];
  status:{
  	'health':number,
  	'invalid':number
  };
  chartOption = new Map();
  // var formatUtil = echarts.format;
  dataData = [];
  originalData = [];
  metricName = [];
  metricNameUnique = [];
  myData = [];
  measureOptions = [];
  selectedMeasureIndex = 0;
  chartHeight:any;
  selectedOrgIndex = 0;

  metricData = {
  "hits" : {
    "hits" : [
      {
        "_source" : {
          "name" : "xixi",
          "tmst" : 1493962623461,
          "total" : 8043288,
          "matched" : 8034775
        }
      },
      {
        "_source" : {
          "name" : "xixi",
          "tmst" : 1493973423461,
          "total" : 9479698,
          "matched" : 9476094
        }
      },
      {
        "_source" : {
          "name" : "xixi",
          "tmst" : 1493987823461,
          "total" : 9194117,
          "matched" : 9164237
        }
      },
      {
        "_source" : {
          "name" : "xixi",
          "tmst" : 1493995023461,
          "total" : 9429018,
          "matched" : 9375324
        }
      },
      {
        "_source" : {
          "name" : "xixi",
          "tmst" : 1494009423461,
          "total" : 8029660,
          "matched" : 7979653
        }
      },
      {
        "_source" : {
          "name" : "haha",
          "tmst" : 1493959023461,
          "total" : 1086389,
          "matched" : 1083336
        }
      },
      {
        "_source" : {
          "name" : "haha",
          "tmst" : 1493973423461,
          "total" : 1090650,
          "matched" : 1090445
        }
      },
      {
        "_source" : {
          "name" : "haha",
          "tmst" : 1493980623461,
          "total" : 1088940,
          "matched" : 1079003
        }
      },
      {
        "_source" : {
          "name" : "haha",
          "tmst" : 1493995023461,
          "total" : 1048833,
          "matched" : 1047890
        }
      },
      {
        "_source" : {
          "name" : "haha",
          "tmst" : 1494013023461,
          "total" : 1063349,
          "matched" : 1055783
        }
      }
    ]
  }
  };

  public duplicateArray() {
  let arr = [];
  this.finalData.forEach((x) => {
    arr.push(Object.assign({}, x));
  });
  console.log(arr);
  // arr.map((x) => {x.status = DEFAULT});
  return this.finalData.concat(arr);
  }

  ngOnInit() {
  	this.finalData = this.getMetricService.renderData();
    // this.originalData = this.duplicateArray();
    this.originalData = JSON.parse(JSON.stringify(this.finalData));
    // this.originalData = $.extend(true, {}, this.finalData);
    // this.originalData = $.map(this.originalData, function(value, index) {
    // return [value];
    // });
    console.log(this.originalData);
  	// for(let data of this.finalData){
  	// 	let org = {
  	// 		'name':data.name,
  	// 		'dq':data.dq,
  	// 		'metrics':[]
  	// 	};
  	// 	for(let metric of data.metrics){
  	// 		let node = {
  	// 			'name':metric.name,
  	// 			'dq':metric.dq,
  	// 			'timestamp':metric.timestamp,
  	// 			'details':[]
  	// 		}
  	// 		for(let detail of metric.details){
   //        let detailNode = {
   //          "_source":{
   //            // 'matched':detail._source.matched,
   //            // 'name':detail._source.name,
   //            // 'tmst':detail._source.tmst,
   //            // 'total':detail._source.total
   //            'matched':1,
   //            'name':'d',
   //            'tmst':11,
   //            'total':11
   //          }
   //        }
  	// 			node.details.push(detailNode);
  	// 		}
  	// 		org.metrics.push(node);
  	// 	}
  	// 	this.originalData.push(org);
  	// }
    // this.originalData = this.finalData.map(x =>Object.assign({},x));
    // this.originalData = $.extend(true,[],this.finalData);
    // this.originalData = Object.assign([], this.finalData);
  	var self = this;
  	setTimeout(function(){
  		// body...
  		self.redraw(self.finalData);
  	},0);
  	
  }

  getOption(parent,i){
   	return this.chartOption.get('thumbnail'+parent+'-'+i);
   }

	// this.originalData = angular.copy(this.finalData);
	    // if($routeParams.sysName && this.originalData && this.originalData.length > 0){
	    //   for(var i = 0; i < this.originalData.length; i ++){
	    //     if(this.originalData[i].name == $routeParams.sysName){
	    //       this.selectedOrgIndex = i;
	    //       this.changeOrg();
	    //       this.orgSelectDisabled = true;
	    //       break;
	    //     }
	    //   }
	    // }
	    // $timeout(function() {
	    //     redraw(this.finalData);
	    // });
	   // });
	// });
//          $http.post(url_dashboard, {"query": {"match_all":{}},"size":1000}).success(function(res) {

  redraw (data) {
    this.chartHeight = $('.chartItem:eq(0)').width()*0.8+'px';
      for(let i = 0;i<data.length;i++){
          var parentIndex = i;
          for(let j = 0;j<data[i].metrics.length;j++){
          	let index = j;
          	let chartId = 'thumbnail' + parentIndex + '-' + index;
            $('#thumbnail'+parentIndex+'-'+index).get(0).style.width = $('#thumbnail'+parentIndex+'-'+index).parent().width()+'px';
            $('#thumbnail'+parentIndex+'-'+index).get(0).style.height = this.chartHeight;
  			    this.chartOption.set(chartId,this.chartService.getOptionThum(data[i].metrics[j]));
          }
      }
  }

  goTo(parent,i){
   	this.router.navigate(['/detailed/'+this.finalData[parent].metrics[i].name]) ;
  }

  changeOrg() {
      this.selectedMeasureIndex = undefined;
      this.measureOptions = [];
      this.finalData = [];
      if(this.selectedOrgIndex == 0){
        for(let data of this.originalData){
      		this.finalData.push(data);
        }
      }
      else {
        var org = this.originalData[this.selectedOrgIndex-1];
        this.finalData.push(org);
        for(let metric of org.metrics){
        	if(this.measureOptions.indexOf(metric.name) == -1){
        		this.measureOptions.push(metric.name);
        	}
        }
      }
      var self = this;
      setTimeout(function() {
          self.redraw(self.finalData);
      }, 0);
      console.log(this.originalData);
  };

  changeMeasure() {
      this.finalData = [];
      if(this.selectedOrgIndex == 0){
      	for(let data of this.originalData){
      		this.finalData.push(data);
      	}
      } else {
        // var org = this.originalData[this.selectedOrgIndex-1];
        var org = JSON.parse(JSON.stringify(this.originalData[this.selectedOrgIndex-1]));
        this.finalData.push(org);
      }
      if(this.selectedMeasureIndex != undefined && this.selectedMeasureIndex != 0){
        var measure = this.measureOptions[this.selectedMeasureIndex-1];
        	for(let sys of this.finalData){
            let oldMetrics = sys.metrics;
            sys.metrics = [];
            for(let i = 0;i<oldMetrics.length;i++){
              if(oldMetrics[i].name == measure) {
                sys.metrics.push(oldMetrics[i]);
              }
            };
        };
      }
      var self = this;
      setTimeout(function() {
          self.redraw(self.finalData);
      }, 0);
      console.log(this.originalData);
  }

        // function resizePieChart() {
        //   $('#data-asset-pie').css({
        //       height: $('#data-asset-pie').parent().width(),
        //       width: $('#data-asset-pie').parent().width()
        //   });
        // }

        // this.$on('resizeHandler', function() {
        //   if($route.current.$$route.controller == 'MetricsCtrl') {
        //     console.log('metrics resize');
        //     redraw(this.dataData);
        //   }
        // });
}
