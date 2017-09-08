import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Ng2SmartTableModule ,LocalDataSource} from 'ng2-smart-table';
import { DatePipe } from '@angular/common';
import * as $ from 'jquery';

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

  intervalFormat(second){
     if(second<60)
         return (second + 's');
     else if(second<3600)
     {
         if(second%60==0)
             return(second / 60 + 'min');
         else 
             return((second - second % 60) / 60 + 'min'+second % 60 + 's');
     }
     else 
     {
         if(second%3600==0)
             return ( second / 3600 + 'h');
         else
         {
             second = (second - second % 3600) / 3600 + 'h';
             var s = second % 3600;
             return ( second + (s-s%60)/60+'min'+s%60+'s');
         }
     }
  }


  ngOnInit():void {
    var self = this;
  	this.http.get('http://localhost:8080/jobs/').subscribe(data =>{
        $('.ng2-smart-sort-link').css('color','white');
        this.results = Object.keys(data).map(function(index){
          let job = data[index];

          job.nextFireTime = self.parseDate(job.nextFireTime);

          if(job.previousFireTime != -1){
              job.previousFireTime = self.parseDate(job.previousFireTime);
          }else{
              job.previousFireTime = '--/--/--/' + ' ' + '--:--';
          }
          job.interval = self.intervalFormat(job.interval);
          return job;
        });      
        this.source = new LocalDataSource(this.results);
        this.source.load(this.results);
    },
    err =>{
        $('.ng2-smart-sort-link').css('color','white');
    });
  };
}
