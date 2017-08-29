import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy,AfterViewInit } from '@angular/core';
import {ChartService} from '../../service/chart.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {HttpClient} from '@angular/common/http';
import * as $ from 'jquery';

@Component({
  selector: 'app-detail-metric',
  templateUrl: './detail-metric.component.html',
  styleUrls: ['./detail-metric.component.css'],
  providers:[ChartService]
})
export class DetailMetricComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(chartService:ChartService,private route: ActivatedRoute,
  private router: Router,private http:HttpClient) {
  	route.params.subscribe(val=>{
  	this.currentMeasure = this.route.snapshot.paramMap.get('name');
  	this.chartOption = chartService.getOptionBig(this.getData(this.currentMeasure));
    $('#bigChartDiv').height(window.innerHeight-120+'px');
    $('#bigChartDiv').width(window.innerWidth-400+'px');
  	$('#bigChartContainer').show();
  	})
  	// this.chartService = chartService;
  };
  // chartService:any;
  selectedMeasure:string;
  chartOption:{};
  currentMeasure:string;
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
      }
    ]
  }
}
;



  ngOnInit() {
  	console.log('init');
  	this.currentMeasure = this.route.snapshot.paramMap.get('name');
  	// this.chartOption = this.chartService.getOptionBig(this.getData(this.currentMeasure));
    $('#bigChartDiv').height(window.innerHeight-120+'px');
    $('#bigChartDiv').width(window.innerWidth-400+'px');
  	$('#bigChartContainer').show();
  }

  ngOnDestroy(){
  	console.log('destroy');
  }

  ngAfterViewInit(){
  	console.log('after view init')
  }

  // ngOnChanges(changes:SimpleChanges){
  // 	// this.chartOption = this.chartService.getOptionBig(this.getData(this.currentMeasure));
  //   $('#bigChartDiv').height(window.innerHeight-120+'px');
  //   $('#bigChartDiv').width(window.innerWidth-400+'px');
  // 	$('#bigChartContainer').show();
  // }

  getData(metricName){
  	 var metricDetailUrl = '...';
      let data = this.metricData;
      // this.http.post(metricDetailUrl, {"query": {  "bool":{"filter":[ {"term" : {"name": metricName }}]}},  "sort": [{"tmst": {"order": "asc"}}],"size":1000}).subscribe( data=> {
       	var metric = {
       		'name':'',
       		'timestamp':0,
       		'dq':0,
       		'details':[]
       	};
       	metric.name = data.hits.hits[0]._source.name;
       	metric.timestamp =data.hits.hits[data.hits.hits.length-1]._source.tmst;
       	metric.dq = data.hits.hits[data.hits.hits.length-1]._source.matched/data.hits.hits[data.hits.hits.length-1]._source.matched*100;
       	metric.details = new Array();
       	for(let point of data.hits.hits){
       	    metric.details.push(point);
       	};
       	return metric;
     // });
  }

  closeBigChart(){
  	$('#bigChartContainer').hide();
  	$('#mainWindow').show();
  };
}
