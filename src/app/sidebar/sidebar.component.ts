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
  status:{
  	'health':number,
  	'invalid':number
  };
  chartOption = new Map();
  // var formatUtil = echarts.format;

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
  
  onResize(event){
    console.log('sidebar resize');
    if(window.innerWidth < 992) {
      $('#rightbar').css('display', 'none');
    } else {
      $('#rightbar').css('display', 'block');
      this.resizeSideChart();
    }
  }

  resizeSideChart(){
    $('#side-bar-metrics').css({
           height: $('#mainContent').height()-$('#side-bar-stats').outerHeight()+70
       });
       for(let i=0;i<this.finalData.length;i++){
           for(let j=0;j<this.finalData[i].metrics.length;j++){
             if (!this.finalData[i].metrics[j].tag) {
             this.draw(this.finalData[i].metrics[j], i, j);
           }
           }
       }
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
