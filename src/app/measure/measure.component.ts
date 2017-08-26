import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@Component({
  selector: 'app-measure',
  templateUrl: './measure.component.html',
  styleUrls: ['./measure.component.css']
})
export class MeasureComponent implements OnInit {
  results:object;

  settings = {
    columns: {
      name: {
        title: 'Measure Name',
        editable:false,
        type:'html'
      },
      type: {
        title: 'Measure Type',
        editable:false,
      },
      description: {
        title: 'Description',
        editable:false,
      },
      organization: {
        title: 'Organization',
        editable:false,
      }
    },
    actions:{
    	position:'right',
    	add:false,
    	columnTitle:'Action',
    	edit:true,
    	delete:true
    },

    hideSubHeader:true,
    edit:{
    	editButtonContent:'<i class="fa fa-eye"></i>&nbsp;&nbsp;'
    },
    delete:{
    	deleteButtonContent:'<i class="fa fa-trash-o"></i>'
    },
    mode:'external'

  };
  
  constructor(private http:HttpClient) { };

  ngOnInit():void {
  	// this.http.get('http://localhost:8080/measures').subscribe(data =>{
  	// this.http.get('./measures.json').subscribe(data =>{
  	// 	this.results = data;
  	// });
  	this.results = [{"id":1,"name":"waq","description":"waq","organization":"waq","type":"accuracy","source":{"id":1,"type":"HIVE","version":"1.2","config":{"database":"default","table.name":"users_info_src"}},"target":{"id":2,"type":"HIVE","version":"1.2","config":{"database":"default","table.name":"users_info_target"}},"evaluateRule":{"id":1,"sampleRatio":0,"rules":"$source['user_id'] == $target['user_id'] AND $source['first_name'] == $target['first_name'] AND $source['last_name'] == $target['last_name'] AND $source['address'] == $target['address'] AND $source['email'] == $target['email'] AND $source['phone'] == $target['phone'] AND $source['post_code'] == $target['post_code']"},"owner":"test"},{"id":2,"name":"viewitem_hourly","description":"qq","organization":"hadoop","type":"accuracy","source":{"id":3,"type":"HIVE","version":"1.2","config":{"database":"default","table.name":"data_exp"}},"target":{"id":4,"type":"HIVE","version":"1.2","config":{"database":"default","table.name":"data_only"}},"evaluateRule":{"id":2,"sampleRatio":0,"rules":"$source['uid'] == $target['uage']"},"owner":"test"}];
  };
  data = this.results;
}
