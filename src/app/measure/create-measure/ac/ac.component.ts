import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ToasterModule, ToasterService} from 'angular2-toaster';
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
  constructor(name:string,type:string,comment:string,selected:boolean){
    this.name = name;
    this.type = type;
    this.comment = comment;
    this.selected = false;
  }
  getSelected(){
    return this.selected;
  }
  setSelected(selected){
    this.selected = selected;
  }
}

@Component({
  selector: 'app-ac',
  templateUrl: './ac.component.html',
  styleUrls: ['./ac.component.css']
})

export class AcComponent implements OnInit {

  currentStep = 1;
  selection = [];
  selectedAll = false;
  selectedAllTarget = false;
  selectionTarget = [];
  map = [];
  mappings = [];
  matches = [];
  dataAsset = '';
  rules = '';
  currentDB = '';
  currentTable = '';
  currentDBTarget = '';
  currentTableTarget = '';
  schemaCollection:Col[];
  schemaCollectionTarget:Col[];
  matchFunctions = ['==', '!==', '>', '>=','<',"<="];

  measureTypes = ['accuracy','validity','anomaly detection','publish metrics'];
  type = 'accuracy';
  newMeasure = {
    "name":'',
    "description":'',
    "organization":'',
    "type":'',
    "source":{
        "type":"HIVE",
        "version":"1.2",
        "config":{
            "database":'',
            "table.name":'',
        },
    },
    "target":{
        "type":"HIVE",
        "version":"1.2",
        "config":{
            "database":'',
            "table.name":'',
        },
    },
    "evaluateRule":{
        "rules":'',
    },
    "owner":'',
    "mappings":[],
  };
  name:'';
  desc:'';
  org:'';
  owner = 'test';
  createResult :any;

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

  addMapping(x,i){   
    this.mappings[i] = x;
  }

  toggleSelection (row) {
      row.selected = !row.selected;
      var idx = this.selection.indexOf(row.name);
      // is currently selected
      if (idx > -1) {
          this.selection.splice(idx, 1);
          this.selectedAll = false;
      }
      // is newly selected
      else {
          this.selection.push(row.name);
      }
  };

  toggleSelectionTarget (row) {
      row.selected = !row.selected;
      var idx = this.selectionTarget.indexOf(row.name);
      // is currently selected
      if (idx > -1) {
          this.selectionTarget.splice(idx, 1);
          this.selectedAllTarget = false;
      }
      // is newly selected
      else {
          this.selectionTarget.push(row.name);
      }
  };

  toggleAll () {
    this.selectedAll = !this.selectedAll;
    this.selection = [];
    for(var i =0; i < this.schemaCollection.length; i ++){
      this.schemaCollection[i].selected = this.selectedAll;
      if (this.selectedAll) {
          this.selection.push(this.schemaCollection[i].name);
      }
    }
  };

  toggleAllTarget () {
    this.selectedAllTarget = !this.selectedAllTarget;
    this.selectionTarget = [];
    for(var i =0; i < this.schemaCollectionTarget.length; i ++){
      this.schemaCollectionTarget[i].selected = this.selectedAllTarget;
      if (this.selectedAllTarget) {
          this.selectionTarget.push(this.schemaCollectionTarget[i].name);
      }
    }
  };

  next (form) {
      this.currentStep++;
  }
  prev (form) {
      this.currentStep--;
  }
  goTo (i) {
      this.currentStep = i;
  }
  submit (form) {                
      // form.$setPristine();
      var rule = '';
      this.newMeasure={
        "name":this.name,
        "description":this.desc,
        "organization":this.org,
        "type":this.type,
        "source":{
            "type":"HIVE",
            "version":"1.2",
            "config":{
                "database":this.currentDB,
                "table.name":this.currentTable,
            },
        },
        "target":{
            "type":"HIVE",
            "version":"1.2",
            "config":{
                "database":this.currentDBTarget,
                "table.name":this.currentTableTarget,
            },
        },
        "evaluateRule":{
            "rules":'',
        },
        "owner":this.owner,
        mappings:[],
      };
      var mappingRule = function(src, tgt, matches) {
          return "$source['" + src + "'] " + matches + " $target['" + tgt + "']";
      }
      var self = this;
      var rules = this.selectionTarget.map(function(item, i) {
          return mappingRule(self.selection[i], item, self.matches[i]);
      });
      rule = rules.join(" AND ");
      this.rules = rule;
      this.newMeasure.evaluateRule.rules = rule;
      for(var i =0; i < this.selectionTarget.length; i ++){
        this.newMeasure.mappings.push({target:this.selectionTarget[i],
                        src:this.mappings[i],
                        matchMethod: this.matches[i]});
      }
      this.visible = true;
      setTimeout(() => this.visibleAnimate = true, 100);
  }

  save() {
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

  targetOptions: ITreeOptions = {
    displayField: 'name',
    isExpandedField: 'expanded',
    idField: 'id',
    actionMapping: {
      mouse: {
        click: (tree, node, $event) => {
          if (node.hasChildren) {
            this.currentDBTarget = node.data.name;
            this.currentTableTarget = '';
            TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
          }
          else if(node.data.cols)
          {
            this.currentTableTarget = node.data.name;
            this.currentDBTarget = node.data.parent;
            this.schemaCollectionTarget = node.data.cols;
          }
        }
      }
    },
    animateExpand: true,
    animateSpeed: 30,
    animateAcceleration: 1.2
  };

  errorMessage = function(i, msg) {
      var errorMsgs = ['Please select at least one attribute!', 'Please select at least one attribute in target, make sure target is different from source!', 'Please make sure to map each target to a unique source.', 'please complete the form in this step before proceeding'];
      if (!msg) {
          // toaster.pop('error', 'Error', errorMsgs[i - 1], 0);
      } else {
          // toaster.pop('error', 'Error', msg, 0);
      }
  };

  nodeList:object[];
  constructor(toasterService: ToasterService,private http: HttpClient,private router:Router) {
    this.toasterService = toasterService;
  };

  // toast: Toast = {
  //   type: 'success',
  //   title: 'close button',
  //   showCloseButton: true
  // };
 
  // this.toasterService.pop(toast);

  popToast() {
      this.toasterService.pop('success', 'Args Title', 'Args Body');
  }

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
