import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ToasterModule, ToasterService,ToasterContainerComponent} from 'angular2-toaster';
import * as $ from 'jquery';
import { HttpClient} from '@angular/common/http';
import { Router} from "@angular/router";


class node {
  name: string;
  id: number;
  children:object[];
  isExpanded:boolean;
  cols:Col[];
  parent:string;
};

class Col{
  name:string;
  type:string;
  comment:string;
  selected :boolean;
  isNum:boolean;
  isExpanded:boolean;
  rules:string[];
  groupby:string;
  RE:string;
  // selectedRules:{[rule:string]:boolean};
  selectedRules:boolean[];
  constructor(name:string,type:string,comment:string,selected:boolean){
    this.name = name;
    this.type = type;
    this.comment = comment;
    this.selected = false;
    this.isExpanded = false;
    this.groupby = '';
    this.RE = '';
    if(this.type=='bigint'||this.type=='int'||this.type=='smallint'||this.type==''||this.type=='double'
      ||this.type=='float'){
      this.isNum = true;
    }
    this.selectedRules = [false,false,false,false,false,false,false,false,false,false,false];
    this.rules = [];
  }
  getSelected(){
    return this.selected;
  }
  setSelected(selected){
    this.selected = selected;
  }
}

@Component({
  selector: 'app-pr',
  templateUrl: './pr.component.html',
  styleUrls: ['./pr.component.css']
})
export class PrComponent implements OnInit {

  currentStep = 1;
  selection : Col[];
  selectedAll = false;
  rules = '';
  currentDB = '';
  currentTable = '';
  schemaCollection:Col[];
  totallen = 0;


  type = 'profiling';
  newMeasure = {
    "name": "",
    "process.type": "batch",
    "data.sources": [
      {
        "name": "source",
        "connectors": [
          {
            "type": "hive",
            "version": "1.2",
            "config": {
              "database": "",
              "table.name":""
            }
          }
        ]
      }
    ],
    "evaluateRule": {
      "rules": [
        {
          "dsl.type": "griffin-dsl",
          "dq.type": "profiling",
          "rule": "",
          "details": {}
        }
      ]
    }
  };
  name:'';
  createResult :any;

  ruleMap = [
             'total count',
             'distinct count',
             'null detection count',
             'regular expression detection count',
             'rule detection count',
             'max','min','median','avg',
             'enum detection group count',
             'groupby count']

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

  toggleSelection (row) {
      row.selected = !row.selected;
      console.log(row);
      var idx = this.selection.indexOf(row);
      // is currently selected
      if (idx > -1) {
          this.selection.splice(idx, 1);
          this.selectedAll = false;
      }
      // is newly selected
      else {
          this.selection.push(row);
      }
  };

  toggleSelectionRules (row,index) {
      
      row.selectedRules[index] = !row.selectedRules[index];
      var idx = row.rules.indexOf(this.ruleMap[index]);
      // is currently selected
      if (idx > -1) {
          row.rules.splice(idx, 1);
      }
      // is newly selected
      else {
          row.rules.push(this.ruleMap[index]);
      }
  };

  toggleAll () {
    this.selectedAll = !this.selectedAll;
    this.selection = [];
    for(var i =0; i < this.schemaCollection.length; i ++){
      this.schemaCollection[i].selected = this.selectedAll;
      if (this.selectedAll) {
          this.selection.push(this.schemaCollection[i]);
      }
    }
  };

  transferRule(rule,col){
    switch(rule){
      // case 'total count':
      //   return 'count(source.'+col+')';
      // case 'distinct count':
      //   return 'distinct count(source.'+col+')';
      // case 'null detection count':
      //   return 'count(source.'+col+') where source.'+col+' is null';
      // case 'regular expression detection count':
      //   return 'count(source.'+col+') where source.'+col+' like ';
      // case 'rule detection count':
      //   return 'count(source.'+col+') where source.'+col+' like ';
      // case 'max':
      //   return 'max(source.'+col+')';
      // case 'min':
      //   return 'min(source.'+col+')';
      // case 'median':
      //   return 'median(source.'+col+')';
      // case 'avg':
      //   return 'average(source.'+col+')';
      // case 'enum detection group count':
      //   return 'source.'+col+' group by source.'+col+'';
      // case 'groupby count':
      //   return 'source.'+col+' group by source.'+col+'';
      case 'total count':
        return 'SELECT COUNT(*) FROM source';
      case 'distinct count':
        return 'SELECT DISTINCT COUNT(source.'+col.name+') FROM source';
      case 'null detection count':
        return 'SELECT COUNT(source.'+col.name+') FROM source WHERE source.'+col.name+' is null';
      case 'regular expression detection count':
        return 'SELECT COUNT(source.'+col.name+') FROM source WHERE source.'+col.name+' like '+col.RE;
      case 'rule detection count':
        return 'SELECT COUNT(source.'+col.name+') FROM source WHERE source.'+col.name+' like ';
      case 'max':
        return 'SELECT max(source.'+col.name+') FROM source';
      case 'min':
        return 'SELECT min(source.'+col.name+') FROM source';
      case 'median':
        return 'SELECT median(source.'+col.name+') FROM source';
      case 'avg':
        return 'SELECT average(source.'+col.name+') FROM source';
      case 'enum detection group count':
        return 'source.'+col.name+' group by source.'+col.name+'';
      case 'groupby count':
        return 'source.'+col.name+' group by source.'+col.name+' '+col.groupby;
    }
  }

  next (form) {
      if(this.formValidation(this.currentStep)){
      this.currentStep++;
    }else{
      this.toasterService.pop('error','Error!','Please select at least one attribute!');
          return false;
    }
  }

  formValidation = function(step) {
       if (step == undefined) {
           step = this.currentStep;
       }
       if (step == 1) {
           return this.selection && this.selection.length > 0;
       } else if (step == 2) {
           for(let item of this.selection){
             this.totallen = this.totallen + item.rules.length;
           }
           return (this.totallen > 0)
       } else if (step == 3) {
       }
       return false;
   } 


  prev (form) {
      this.currentStep--;
  }
  goTo (i) {
      this.currentStep = i;
  }
  submit (form) {                
      // form.$setPristine();
      if (!form.valid) {
        this.toasterService.pop('error', 'Error!', 'please complete the form in this step before proceeding');
        return false;
      }
      this.newMeasure = {
        "name": this.name,
        "process.type": "batch",
        "data.sources": [
          {
            "name": "source",
            "connectors": [
              {
                "type": "hive",
                "version": "1.2",
                "config": {
                  "database": this.currentDB,
                  "table.name":this.currentTable
                }
              }
            ]
          }
        ],
        "evaluateRule": {
          "rules": [
            {
              "dsl.type": "griffin-dsl",
              "dq.type": "profiling",
              "rule": "",
              "details": {}
            }
          ]
        }
      };
     
      var self = this;
      var rule = '';
      for(let item of this.selection){
          for(let itemRule of item.rules){
            rule = rule + this.transferRule(itemRule,item)+',';
          }
      }
      this.newMeasure.evaluateRule.rules[0].rule = rule;
      this.visible = true;
      setTimeout(() => this.visibleAnimate = true, 100);
  }

  save() {
    console.log(this.newMeasure);
    this.http
    .post('http://localhost:8080/measure', this.newMeasure)
    .subscribe(data => {
        this.createResult = data;
        var self = this;
        setTimeout(function () {
          self.hide();
          self.router.navigate(['/measures']);
        },0)
    },
    err => {
      console.log('Something went wrong!');
    });
    
  }

  data: { [key: string]: Array<object>; } = {
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
  };
  
  options: ITreeOptions = {
    displayField: 'name',
    isExpandedField: 'expanded',
    idField: 'id',
    actionMapping: {
      mouse: {
        click: (tree, node, $event) => {
          if (node.hasChildren) {
            this.currentDB = node.data.name;
            this.currentTable = '';
            TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
          }
          else if(node.data.cols)
          {
            this.currentTable = node.data.name;
            this.currentDB = node.data.parent;
            this.schemaCollection = node.data.cols;
          }
        }
      }
    },
    animateExpand: true,
    animateSpeed: 30,
    animateAcceleration: 1.2
  };

  nodeList:object[];
  constructor(toasterService: ToasterService,private http: HttpClient,private router:Router) {
    this.toasterService = toasterService;
    this.selection = [];
  };


  ngOnInit() {
    this.nodeList = new Array();
    let i = 1;
    for (let db in this.data) {
        let new_node = new node();
        new_node.name = db;
        new_node.id = i;
        new_node.isExpanded = true;
        i++;
        new_node.children = new Array();
        for(let i = 0;i<this.data[db].length;i++){
          let new_child = new node();
          new_child.name = this.data[db][i]['tableName'];
          new_node.children.push(new_child);
          new_child.isExpanded = false;
          new_child.parent = db;
          new_child.cols = Array<Col>();
          for(let j = 0;j<this.data[db][i]['sd']['cols'].length;j++){
              let new_col = new Col(this.data[db][i]['sd']['cols'][j].name,
              this.data[db][i]['sd']['cols'][j].type,
              this.data[db][i]['sd']['cols'][j].comment,false);
              new_child.cols.push(new_col);
          }
        }
        this.nodeList.push(new_node);
    }
  };
}
