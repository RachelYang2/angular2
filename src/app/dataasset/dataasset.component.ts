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
        type:'html'
      },
      dbName: {
        title: 'DB Name',
        editable:false
      },
      owner: {
        title: 'Owner',
        editable:false
      },
      createTime: {
        title: 'Creation Time',
        editable:false
      },
      lastAccessTime: {
        title: 'Last Access Time',
        editable:false
      },
      location: {
        title: 'Location',
        editable:false
      },
    },


    hideSubHeader:true,
    mode:'external',
    pager : {
      display : true,
      perPage:2
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

  ngOnInit() {
    var data={
    "default": [
        {
            "tableName": "ext",
            "dbName": "default",
            "owner": "hadoop",
            "createTime": 1488353464,
            "lastAccessTime": 0,
            "retention": 0,
            "sd": {
                "cols": [
                    {
                        "name": "id",
                        "type": "int",
                        "comment": null,
                        "setName": true,
                        "setComment": false,
                        "setType": true
                    },
                    {
                        "name": "name",
                        "type": "string",
                        "comment": null,
                        "setName": true,
                        "setComment": false,
                        "setType": true
                    },
                    {
                        "name": "age",
                        "type": "int",
                        "comment": null,
                        "setName": true,
                        "setComment": false,
                        "setType": true
                    }
                ],
                "location": "hdfs://10.9.246.187/user/hive/ext",
            },
        },
        {
            "tableName": "ext1",
            "dbName": "default",
            "owner": "hadoop",
            "createTime": 1489382943,
            "lastAccessTime": 0,
            "retention": 0,
            "sd": {
                "cols": [
                    {
                        "name": "id",
                        "type": "int",
                        "comment": null,
                        "setName": true,
                        "setComment": false,
                        "setType": true
                    },
                    {
                        "name": "name",
                        "type": "string",
                        "comment": null,
                        "setName": true,
                        "setComment": false,
                        "setType": true
                    },
                    {
                        "name": "age",
                        "type": "int",
                        "comment": null,
                        "setName": true,
                        "setComment": false,
                        "setType": true
                    }
                ],
                "location": "hdfs://10.9.246.187/user/hive/ext1",
            },
        }
    ],
    "griffin": [
        {
            "tableName": "avr_out",
            "dbName": "griffin",
            "owner": "hadoop",
            "createTime": 1493892603,
            "lastAccessTime": 0,
            "retention": 0,
            "sd": {
                "cols": [
                    {
                        "name": "id",
                        "type": "bigint",
                        "comment": null,
                        "setName": true,
                        "setComment": false,
                        "setType": true
                    },
                    {
                        "name": "age",
                        "type": "int",
                        "comment": null,
                        "setName": true,
                        "setComment": false,
                        "setType": true
                    },
                    {
                        "name": "desc",
                        "type": "string",
                        "comment": null,
                        "setName": true,
                        "setComment": false,
                        "setType": true
                    }
                ],
                "location": "hdfs://10.9.246.187/griffin/data/batch/avr_out",
            },
        }
    ],
  
}

    for (let db in data) {
          for(let table of data[db]){
          this.results.push(table);
          table.location = table.sd.location;
          }       
    }

    // this.http.get('http://localhost:8080/dataassets').subscribe(data =>{
        this.source = new LocalDataSource(this.results);
        this.source.load(this.results);
    // });
  };
}
