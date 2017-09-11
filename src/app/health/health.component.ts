import { Component, OnInit } from '@angular/core';
import  {HttpClient} from '@angular/common/http';
import  {Router} from "@angular/router";
import {GetMetricService} from '../service/get-metric.service'

import * as $ from 'jquery';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css'],
  providers:[GetMetricService]
})
export class HealthComponent implements OnInit {

  constructor(private http: HttpClient,private router:Router,
    public getMetricService: GetMetricService) { };
  chartOption:object;
  // var formatUtil = echarts.format;
  orgs = [];
  dataData = [];
  finalData = [];
  originalData = [];
  metricName = [];
  metricNameUnique = [];
  myData = [];
  originalOrgs = [];
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
  
  onChartClick($event){
    if($event.data.name){
        this.router.navigate(['/detailed/'+$event.data.name]);
    }
  }

  resizeTreeMap() {
    $('#chart1').height( $('#mainWindow').height() - $('.bs-component').outerHeight() );
  };

  parseData(data) {
    var sysId = 0;
    var metricId = 0;
    var result = [];
    	for(let sys of data){
        var item = {
            'id':'',
            'name':'',
            children:[]
        };
        item.id = 'id_'+sysId;
        item.name = sys.name;
        if (sys.metrics != undefined) {
            item.children = [];
            	for(let metric of sys.metrics){
                var itemChild = {
                    id: 'id_' + sysId + '_' + metricId,
                    name: metric.name,
                    value: 1,
                    dq: metric.dq,
                    sysName: sys.name,
                    itemStyle: {
                        normal: {
                            color: '#4c8c6f'
                        }
                    },
                };
                if (metric.dqfail == 1) {
                    itemChild.itemStyle.normal.color = '#ae5732';
                } else {
                    itemChild.itemStyle.normal.color = '#005732';
                }
                item.children.push(itemChild);
                metricId++;
            }
        }
        result.push(item);
        sysId ++;
    }
    return result;
   };

   getLevelOption() {
       return [
           {
               itemStyle: {
                   normal: {
                       borderWidth: 0,
                       gapWidth: 6,
                       borderColor: '#000'
                   }
               }
           },
           {
               itemStyle: {
                   normal: {
                       gapWidth: 1,
                       borderColor: '#fff'
                   }
               }
           }
       ];
   };

  renderTreeMap(res) {
    var data = this.parseData(res);
    var option = {
        title: {
            text: 'Data Quality Metrics Heatmap',
            left: 'center',
            textStyle:{
                color:'white'
            }
        },
        backgroundColor: 'transparent',
        tooltip: {
            formatter: function(info) {
                var dqFormat = info.data.dq>100?'':'%';
                return [
                    '<span style="font-size:1.8em;">' + info.data.sysName + ' &gt; </span>',
                    '<span style="font-size:1.5em;">' + info.data.name+'</span><br>',
                    '<span style="font-size:1.5em;">dq : ' + info.data.dq.toFixed(2) + dqFormat + '</span>'
                ].join('');
            }
        },
        series: [
            {
                name:'System',
                type:'treemap',
                itemStyle: {
                    normal: {
                        borderColor: '#fff'
                    }
                },
                levels: this.getLevelOption(),
                breadcrumb: {
                    show: false
                },
                roam: false,
                nodeClick: 'link',
                data: data,
                width: '95%',
                bottom : 0
            }
        ]
    };
    this.resizeTreeMap();
    this.chartOption = option;
  };

  ngOnInit() {
       this.renderTreeMap(this.getMetricService.renderData());
  };
}
