import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {
  jobs:object;

  settings = {
    columns: {
      jobname: {
        title: 'Job Name',
        editable:false,
        type:''
      },
      sourcepattern: {
        title: 'Source Pattern',
      },
      targetpattern: {
        title: 'Target Pattern',
        editable:false
      },
      previoustime: {
        title: 'Previous Fire Time',
        editable:false
      },
      nexttime: {
        title: 'Next Fire Time',
        editable:false
      },
      state: {
        title: 'Trigger State',
        editable:false
      },
      interval: {
        title: 'Interval'
      },
    },
    actions:{
    	position:'right',
    	add:false,
    	edit:false,
    	columnTitle:'Action',
    	delete:true
    },

    hideSubHeader:true,
    delete:{
    	deleteButtonContent:'<i class="fa fa-trash-o"></i>'
    },
    mode:'external'

  };
  constructor(private http:HttpClient) { };

  ngOnInit():void {
  	this.jobs = [
  	   {
  	   	 groupName:"BA",
         interval:"60",
         jobname:"test-BA-test-1503300883000",
         jobStartTime:"1502294400000",
         easureName:"test",
         nexttime:1503479940000,
         previoustime:1503479880000,
         sourcepattern:"YYYYMMdd-HH",
         targetpattern:"YYYYMMdd-HH",
         state:"NORMAL"
  	   },
  	];
  };
  data = this.jobs;

}
