import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {HttpClient} from '@angular/common/http';
import {ServiceService} from '../../service/service.service';



@Component({
  selector: 'app-measure-detail',
  templateUrl: './measure-detail.component.html',
  providers:[ServiceService],
  styleUrls: ['./measure-detail.component.css']
})
export class MeasureDetailComponent implements OnInit {
  currentId:string;
  constructor(private route: ActivatedRoute,
  private router: Router,private http:HttpClient,public servicecService:ServiceService) { };
  ruleData : any;
  sourceLength : number;
  sourceDB : string;
  targetDB : string;
  sourceTable : string;
  targetTable : string;

  ngOnInit() {
    this.ruleData = {
      'evaluateRule':''
    };
  	var getModelUrl;
    var getModel = this.servicecService.config.uri.getModel; 
  	this.currentId = this.route.snapshot.paramMap.get('id');

    getModelUrl = getModel+"/"+this.currentId;
        // this.http.get(getModelUrl).subscribe(data=>{
          let data = {"id":1,"name":"waq","description":"waq","organization":"waq","type":"accuracy","source":{"id":1,"type":"HIVE","version":"1.2","config":{"database":"default","table.name":"users_info_src"}},"target":{"id":2,"type":"HIVE","version":"1.2","config":{"database":"default","table.name":"users_info_target"}},"evaluateRule":{"id":1,"sampleRatio":0,"rules":"$source['user_id'] == $target['user_id'] AND $source['first_name'] == $target['first_name'] AND $source['last_name'] == $target['last_name'] AND $source['address'] == $target['address'] AND $source['email'] == $target['email'] AND $source['phone'] == $target['phone'] AND $source['post_code'] == $target['post_code']"},"owner":"test"};
          this.ruleData = data;
          this.sourceLength = this.ruleData.evaluateRule.rules.split('AND').length;
          this.sourceDB = this.ruleData.source.config.database;
          this.targetDB = this.ruleData.target.config.database;
          this.sourceTable = this.ruleData.source.config["table.name"];
          this.targetTable = this.ruleData.target.config["table.name"];
         // },err => {
         	// console.log('error');
          // toaster.pop('error', 'Error when geting record', response.message);
        // });
  }

}
