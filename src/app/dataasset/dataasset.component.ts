import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Ng2SmartTableModule ,LocalDataSource} from 'ng2-smart-table';

@Component({
  selector: 'app-dataasset',
  templateUrl: './dataasset.component.html',
  styleUrls: ['./dataasset.component.css']
})
export class DataassetComponent implements OnInit {
  public results = [];
  source:LocalDataSource;
  public visible = false;
  public visibleAnimate = false;
  sourceTable :string;
  targetTable :string;

  settings = {
    columns: {
      tableName: {
        title: 'Table Name',
        editable:false,
        type:'html',
        // width:''
      },
      dbName: {
        title: 'DB Name',
        editable:false,
        width:'10%'
      },
      owner: {
        title: 'Owner',
        editable:false,
        width:'10%'
      },
      createTime: {
        title: 'Creation Time',
        editable:false,
        width:'16%'
      },
      lastAccessTime: {
        title: 'Last Access Time',
        editable:false,
        width:'16%'
      },
      location: {
        title: 'Location',
        editable:false
      },
    },
    actions:{
      position:'right',
      add:false,
      columnTitle:'Action',
      edit:false,
      delete:false
    },
    hideSubHeader:true,
    mode:'external',
    pager : {
      display : true,
      // perPage:2
    }

  };

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }
  constructor(private http:HttpClient) { }

  parseDate(time){
    time = new Date(time);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var day = time.getDate();
    var hour = time.getHours();
    if(hour<10)
      hour = '0' + hour;
    var minute = time.getMinutes();
    if(minute<10)
      minute = '0' + minute;
    var second = time.getSeconds();
    if(second<10)
      second = '0' + second;
    return  ( year +'/'+ month + '/'+ day + ' '+ hour + ':' + minute + ':' + second);
  }

  ngOnInit() {
//     var data={
//     "default": [
//         {
//             "tableName": "ext",
//             "dbName": "default",
//             "owner": "hadoop",
//             "createTime": 1488353464,
//             "lastAccessTime": 0,
//             "retention": 0,
//             "sd": {
//                 "cols": [
//                     {
//                         "name": "id",
//                         "type": "int",
//                         "comment": null,
//                         "setName": true,
//                         "setComment": false,
//                         "setType": true
//                     },
//                     {
//                         "name": "name",
//                         "type": "string",
//                         "comment": null,
//                         "setName": true,
//                         "setComment": false,
//                         "setType": true
//                     },
//                     {
//                         "name": "age",
//                         "type": "int",
//                         "comment": null,
//                         "setName": true,
//                         "setComment": false,
//                         "setType": true
//                     }
//                 ],
//                 "location": "hdfs://10.9.246.187/user/hive/ext",
//             },
//         },
//         {
//             "tableName": "ext1",
//             "dbName": "default",
//             "owner": "hadoop",
//             "createTime": 1489382943,
//             "lastAccessTime": 0,
//             "retention": 0,
//             "sd": {
//                 "cols": [
//                     {
//                         "name": "id",
//                         "type": "int",
//                         "comment": null,
//                         "setName": true,
//                         "setComment": false,
//                         "setType": true
//                     },
//                     {
//                         "name": "name",
//                         "type": "string",
//                         "comment": null,
//                         "setName": true,
//                         "setComment": false,
//                         "setType": true
//                     },
//                     {
//                         "name": "age",
//                         "type": "int",
//                         "comment": null,
//                         "setName": true,
//                         "setComment": false,
//                         "setType": true
//                     }
//                 ],
//                 "location": "hdfs://10.9.246.187/user/hive/ext1",
//             },
//         }
//     ],
//     "griffin": [
//         {
//             "tableName": "avr_out",
//             "dbName": "griffin",
//             "owner": "hadoop",
//             "createTime": 1493892603,
//             "lastAccessTime": 0,
//             "retention": 0,
//             "sd": {
//                 "cols": [
//                     {
//                         "name": "id",
//                         "type": "bigint",
//                         "comment": null,
//                         "setName": true,
//                         "setComment": false,
//                         "setType": true
//                     },
//                     {
//                         "name": "age",
//                         "type": "int",
//                         "comment": null,
//                         "setName": true,
//                         "setComment": false,
//                         "setType": true
//                     },
//                     {
//                         "name": "desc",
//                         "type": "string",
//                         "comment": null,
//                         "setName": true,
//                         "setComment": false,
//                         "setType": true
//                     }
//                 ],
//                 "location": "hdfs://10.9.246.187/griffin/data/batch/avr_out",
//             },
//         }
//     ],
  
// }
    this.http.get('http://localhost:8080/metadata/hive/allTables').subscribe(data =>{
        for (let db in data) {
            for(let table of data[db]){
            this.results.push(table);
            table.location = table.sd.location;
            table.createTime = this.parseDate(table.createTime*1000);
            // table.lastAccessTime = this.parseDate(table.lastAccessTime*1000);
            }       
        }
        this.source = new LocalDataSource(this.results);
        this.source.load(this.results);
    });
  };
}
