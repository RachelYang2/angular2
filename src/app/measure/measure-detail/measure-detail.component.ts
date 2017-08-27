import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-measure-detail',
  templateUrl: './measure-detail.component.html',
  styleUrls: ['./measure-detail.component.css']
})
export class MeasureDetailComponent implements OnInit {
  currentId:string;
  constructor(private route: ActivatedRoute,
  private router: Router,private http:HttpClient) { };
  ruleData : object;
  sourceLength : number;
  sourceDB : string;
  targetDB : string;
  sourceTable : string;
  targetTable : string;

  ngOnInit() {
  	var getModelUrl;
  	this.currentId = this.route.snapshot.paramMap.get('id');

    getModelUrl = '...'+"/"+this.currentId;
        this.http.get(getModelUrl).subscribe(data=>{
          this.ruleData = data;
          this.sourceLength = this.ruleData.evaluateRule.rules.split('AND').length;
          this.sourceDB = this.ruleData.source.config.database;
          this.targetDB = this.ruleData.target.config.database;
          this.sourceTable = this.ruleData.source.config["table.name"];
          this.targetTable = this.ruleData.target.config["table.name"];
         },err => {
         	console.log('error');
          // toaster.pop('error', 'Error when geting record', response.message);
        });
  }

}
