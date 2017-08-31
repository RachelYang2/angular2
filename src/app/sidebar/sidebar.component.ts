import { Component, OnInit } from '@angular/core';
import  {HttpClient} from '@angular/common/http';
import  {Router} from "@angular/router";
import {ChartService} from '../service/chart.service';
import  {DatePipe} from '@angular/common';
import {GetMetricService} from '../service/get-metric.service'
import * as $ from 'jquery';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers:[ChartService,GetMetricService]
})
export class SidebarComponent implements OnInit {

  constructor(private http: HttpClient,
  	private router:Router,
  	public chartService:ChartService,
  	public getMetricService:GetMetricService) {

  }

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

  pageInit() {
    var allDataassets = '...';
    var health_url = '...';
        this.http.get(health_url).subscribe(data => {
          //this.status.health = data.healthyJobCount;
          //this.status.invalid = data.jobCount - data.healthyJobCount;
          // renderDataAssetPie(this.status);
          //this.sideBarList();
        },err => {});
  }

   draw (metric, parentIndex, index) {
   		$('#'+this.finalData[parentIndex].name+index).toggleClass('collapse');
       var chartId = 'chart' + parentIndex + '-' + index;
       document.getElementById(chartId).style.width = ($('.panel-heading').innerWidth()-40)+'px';
       document.getElementById(chartId).style.height = '200px';
       this.chartOption.set(chartId,this.chartService.getOptionSide(metric));
       var self = this;
       $('#'+chartId).unbind('click');
       $('#'+chartId).click(function(e) {
         self.router.navigate(['/detailed/'+self.finalData[parentIndex].metrics[index].name]) ;
       });
   };

   getOption(parent,i){
   	return this.chartOption.get('chart'+parent+'-'+i);
   }

    sideBarList(sysName){
    	this.finalData = this.getMetricService.renderData();
    }

        // $(window).resize(function() {
        //     console.log('sidebar resize');
        //     if(window.innerWidth < 992) {
        //       $('#rightbar').css('display', 'none');
        //     } else {
        //       $('#rightbar').css('display', 'block');
        //       this.resizePieChart();
        //       // this.dataAssetPieChart.resize();
        //       resizeSideChart();
        //     }
        // });

        // resizeSideChart() {
        //     $('#side-bar-metrics').css({
        //         height: $('#mainContent').height()-$('#side-bar-stats').outerHeight()+70
        //     });
        //     angular.forEach(this.finalData, function(sys, sysIndex) {
        //     var sysIndex = sysIndex;
        //     angular.forEach(sys.metrics, function(metric, index) {
        //         if (!metric.tag) {
        //           this.draw(metric, sysIndex, index);
        //         }
        //     })
        //   });
        // }

  ngOnInit() {
  	this.sideBarList(null);
  }

}
