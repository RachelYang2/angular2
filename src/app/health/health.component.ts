import { Component, OnInit } from '@angular/core';
import  {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css']
})
export class HealthComponent implements OnInit {

  constructor(private http: HttpClient) { };

  // var echarts = require('echarts');
  // var formatUtil = echarts.format;
  orgs = [];
  dataData = [];
  finalData = [];
  originalData = [];
  metricName = [];
  metricNameUnique = [];
  myData = [];
  originalOrgs = [];

  resizeTreeMap() {
        $('#chart1').height( $('#mainWindow').height() - $('.bs-component').outerHeight() );
  };
                  parseData(data) {
                    var sysId = 0;
                    var metricId = 0;
                    var result = [];
                    	for(let sys of data){
                        var item = {};
                        item.id = 'id_'+sysId;
                        item.name = sys.name;
                        if (sys.metrics != undefined) {
                            item.children = [];
                            	for(let metric of sys.metrics){
                                var itemChild = {
                                    id: 'id_' + sysId + '_' + metricId,
                                    name: metric.name,// + '(' + metric.dq + '%)',
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
                        left: 'center'
                    },
                    backgroundColor: 'transparent',
                    tooltip: {
                        formatter: function(info) {
                            var dqFormat = info.data.dq>100?'':'%';
                            return [
                                '<span style="font-size:1.8em;">' + formatUtil.encodeHTML(info.data.sysName) + ' &gt; </span>',
                                '<span style="font-size:1.5em;">' + formatUtil.encodeHTML(info.data.name)+'</span><br>',
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
                // this.myChart = echarts.init(document.getElementById('chart1'), 'dark');
                // this.myChart.setOption(option);
                // this.myChart.on('click', function(param) {
                //     if (param.data.name) {
                //         window.location.href = '/#!/detailed/'+param.data.name;
                //     }
                // });
        };
        // this.$on('resizeHandler', function(e) {
        //     if($route.current.$$route.controller == 'HealthCtrl'){
        //         console.log('health resize');
        //         resizeTreeMap();
        //         this.myChart.resize();
        //     }
        // });
  ngOnInit() {
    var url_dashboard = '...' ;
    var url_organization = '...';
    this.http.get(url_organization).subscribe(data => {
               var orgNode = null;
               	for(let value in data['results']){
                    orgNode = new Object();
                    this.orgs.push(orgNode);
                    orgNode.name = value;
                    orgNode.assetMap = data['results'][value];
               }
               this.originalOrgs = angular.copy(this.orgs);
                 // $http.post(url_dashboard, {"query": {"match_all":{}},  "sort": [{"tmst": {"order": "asc"}}],"size":1000}).then(function successCallback(data) {
                // $http.get(url_dashboard).then(function successCallback(data){
                	this.http.get(url_dashboard).subscribe(data => {
                    // angular.forEach(data['results'].hits.hits, function(sys) {
                    	for(let sys of data['results'].hits.hits){
                        var chartData = sys._source;
                        chartData.sort = function(a,b){
                            return a.tmst - b.tmst;
                        }
                    });
                    this.originalData = angular.copy(data.data);
                    this.myData = angular.copy(this.originalData.hits.hits);
                    this.metricName = [];
                    for(var i = 0;i<this.myData.length;i++){
                        this.metricName.push(this.myData[i]._source.name);
                    }
                    this.metricNameUnique = [];
                    // angular.forEach(this.metricName,function(name){
                    for(let name of this.metricName){
                        if(this.metricNameUnique.indexOf(name) === -1){
                            this.dataData[this.metricNameUnique.length] = new Array();
                            this.metricNameUnique.push(name);
                        }
                    };

                    for(var i = 0;i<this.myData.length;i++){
                        for(var j = 0 ;j<this.metricNameUnique.length;j++){
                            if(this.myData[i]._source.name==this.metricNameUnique[j]){
                                this.dataData[j].push(this.myData[i]);
                            }
                        }
                    }
                    for(let sys of this.originalOrgs){
                        var node = null;
                        node = new Object();
                        node.name = sys.name;
                        node.dq = 0;
                        node.metrics = new Array();
                        for (let metric of this.dataData){
                            if(sys.assetMap.indexOf(metric[metric.length-1]._source.name)!= -1){
                                var metricNode = new Object();
                                metricNode.name = metric[metric.length-1]._source.name;
                                metricNode.timestamp = metric[metric.length-1]._source.tmst;
                                metricNode.dq = metric[metric.length-1]._source.matched/metric[metric.length-1]._source.total*100;
                                metricNode.details = new Array();
                                node.metrics.push(metricNode);
                            }
                        }
                        this.finalData.push(node);
                    }
                    this.originalData = angular.copy(this.finalData);
                    this.renderTreeMap(this.finalData);
                });
            };
  }
}
