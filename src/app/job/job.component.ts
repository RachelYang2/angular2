import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Ng2SmartTableModule ,LocalDataSource} from 'ng2-smart-table';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {
  results:object[];
  source:LocalDataSource;
  public visible = false;
  public visibleAnimate = false;

  deletedRow : object;
  sourceTable :string;
  targetTable :string;
  deleteId : string;
  deleteIndex:number;
  deleteGroup :string;

  settings = {
    columns: {
      jobName: {
        title: 'Job Name',
        editable:false,
        type:'html'
      },
      sourcePattern: {
        title: 'Source Pattern',
      },
      targetPattern: {
        title: 'Target Pattern',
        editable:false
      },
      previousFireTime: {
        title: 'Previous Fire Time',
        editable:false
      },
      nextFireTime: {
        title: 'Next Fire Time',
        editable:false
      },
      triggerState: {
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
    mode:'external',
    pager : {
      display : true,
      perPage:2
    }

  };
  constructor(private http:HttpClient) { };

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }

  onDelete($event){
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
    this.deleteId = $event.data.jobName;
    this.deleteGroup = $event.data.groupName;
    this.deleteIndex = $event.index;
    this.deletedRow = $event.data;
  }

  confirmDelete(){
    let deleteUrl = 'http://localhost:8080/jobs/'+ '?group=' + this.deleteGroup+'&jobName='+this.deleteId;
    this.http.delete(deleteUrl).subscribe(data => {
      let deleteResult:any = data;
      if(deleteResult.code==206){
        var self = this;
        setTimeout(function () {
          self.results.splice(self.deleteIndex,1);
          self.source.load(self.results);
          self.hide();
        },0);
      }
    });
  };

  ngOnInit():void {
  	this.http.get('http://localhost:8080/jobs/').subscribe(data =>{
        this.results = Object.keys(data).map(function(index){
          let job = data[index];
          console.log(job);
          job.nextFireTime = new Date(job.nextFireTime);
          var year = job.nextFireTime.getFullYear();
          var month = job.nextFireTime.getMonth() + 1;
          var day = job.nextFireTime.getDate();
          var hour = job.nextFireTime.getHours();
          var minute = job.nextFireTime.getMinutes();
          var second = job.nextFireTime.getSeconds();
          job.nextFireTime = year +'/'+ month + '/'+ day + ' '+ hour + ':' + minute + ':' + second + ':';
          if(job.previousFireTime != -1){
              job.previousFireTime = new Date(job.previousFireTime);
              var year = job.previousFireTime.getFullYear();
              var month = job.previousFireTime.getMonth() + 1;
              var day = job.previousFireTime.getDate();
              var hour = job.previousFireTime.getHours();
              var minute = job.previousFireTime.getMinutes();
              var second = job.previousFireTime.getSeconds();
              job.previousFireTime = year +'/'+ month + '/'+ day + ' '+ hour + ':' + minute + ':' + second + ':';
          }else{
              job.previousFireTime = '--/--/--/' + ' ' + '--:--';
          }
          return job;
        });      
        this.source = new LocalDataSource(this.results);
        this.source.load(this.results);
        // this.source.setPaging(3,2,true);
    });
  };
}
