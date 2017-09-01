import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MaxLengthValidator } from '@angular/forms';
import { NgControlStatus } from '@angular/forms';
import { PatternValidator } from '@angular/forms';
import {MdDatepickerModule} from '@angular/material/@angular/material';


import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToasterModule, ToasterService} from 'angular2-toaster';
import * as $ from 'jquery';
import  {HttpClient,HttpParams} from '@angular/common/http';
import  {Router} from "@angular/router";

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css']
})
export class CreateJobComponent implements OnInit {

  constructor(toasterService: ToasterService,private http: HttpClient,private router:Router) {
    this.toasterService = toasterService;
  };


  
  currentStep = 1;
  Times = ['seconds','minutes','hours'];
  timeType = 'seconds';
  isOpen = false;
  maskOpen = false;

  hourDetail = '00';
  minuteDetail = '00';
  secondDetail = '00';
  timeDetail = '00:00:00';
  periodTime :number;
  StartTime = '';
  sourcePat :'';
  targetPat :'';
  createResult = '';
  jobStartTime : any;


  Measures = [
     {
     	id:'1',
     	name:'test'

     },
     {
     	id:'2',
     	name:'ebay'

     },
     {
     	id:'3',
     	name:'sql'

     }
  ];
  measure = 0;
  ntAccount = 0;
  newJob={
        "sourcePattern":'',
        "targetPattern":'',
        "StartTime":'',
        "interval":'',
        "groupName":'',
      }

  private toasterService: ToasterService;


  public visible = false;
  public visibleAnimate = false;

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }

  changeTime(min,max,increase,time,type){
  	time = parseInt(time);
  	if(increase){
                if(time==max)
                    time = min;
                else time = time + 1;
            }
            else{
                if(time==min)
                    time = max;
                else time = time - 1;
            }
            if(time < 10)
                time = '0' + time;

            if(type==1)
                this.hourDetail = time;
            else if(type==2)
                this.minuteDetail = time;
            else
                this.secondDetail = time;
            this.timeDetail = this.hourDetail+':'+this.minuteDetail+':'+this.secondDetail;
  }
  
  showTime(){
  	this.isOpen = !this.isOpen;
    this.maskOpen = !this.maskOpen;
  }

  close(){
  	this.isOpen = false;
    this.maskOpen = false;
  }

  prev(form){
  	history.back();
  }

  submit () { 
      // form.$setPristine();
      var period;
      if(this.timeType=='minutes')
          period = this.periodTime *60;
      else if(this.timeType=='hours')
          period = this.periodTime * 3600;
      else period = this.periodTime;
      var rule = '';
      var time :number;
      var startTime = this.jobStartTime;
      var year = this.jobStartTime.getFullYear();
      var month = this.jobStartTime.getMonth();
      var day = this.jobStartTime.getDay();
      var standtime = month + '/' + day + '/' + year;
      console.log(standtime);
      // var year = this.jobStartTime.split('/')[2];
      // var month = this.jobStartTime.split('/')[0];
      // var day = this.jobStartTime.split('/')[1];
      startTime = year +'-'+ month + '-'+ day + ' '+ this.timeDetail;
      console.log(startTime);
      time = Date.parse(this.jobStartTime);
      if(isNaN(time)){
         // toaster.pop('error','Please input the right format of start time');
         console.log('erro');
         this.toasterService.pop('error','Please input the right format of start time');
          return;
      }
      this.newJob={
        "sourcePattern":this.sourcePat,
        "targetPattern":this.targetPat,
        "StartTime":startTime,
        "interval":period,
        "groupName":'BA',
      },
      this.visible = true;
      setTimeout(() => this.visibleAnimate = true, 100);
  }

  popToast() {
        this.toasterService.pop('success', 'Args Title', 'Args Body');
  }

  save() {
  	var date = new Date();
  	var datastr = date.toString();
    var month = date.getMonth()+1;
    var timestamp = Date.parse(datastr);
    var jobName = this.Measures[this.measure].name + '-BA-' + this.ntAccount + '-' + timestamp;
    // var newJob = 'http://localhost:8080/jobs' + '?group=' + this.newJob.groupName + '&jobName=' + jobName + '&measureId=' + this.Measures[this.measure].id;
    this.http
    .post('http://localhost:8080/jobs', this.newJob,{
        params: new HttpParams().set('group', this.newJob.groupName).set('jobName', jobName).set('measureId', this.Measures[this.measure].id),
    })
    .subscribe(data => {
        this.createResult = data['results'];
    },
    err => {
      console.log('Error when creating job');
    });
    this.hide();
    this.router.navigate(['/jobs']);
  }

  data: { [key: string]: Array<object>; } = {

  }

  errorMessage = function(i, msg) {
      var errorMsgs = ['Please complete the form!', 'please complete the form in this step before proceeding'];
      if (!msg) {
          // toaster.pop('error', 'Error', errorMsgs[i - 1], 0);
          this.toasterService.pop('error', 'Error', errorMsgs[i - 1], 0);
      } else {
          // toaster.pop('error', 'Error', msg, 0);
      }
  };

  setHeight(){
  	$('#md-datepicker-0').height(250);
  }

  ngOnInit() {
     
  // var getMeasureUrl = '...';
  //       this.http.get(getMeasureUrl).subscribe(function successCallback(res){
  //           // angular.forEach(res.data,function(measure){
  //           //     this.Measures.push(measure);
  //           })
  //           this.measure = 0;
  //       })

  }

}
