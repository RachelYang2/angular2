import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToasterModule, ToasterService} from 'angular2-toaster';
import * as $ from 'jquery';

class node {
  name: string;
  id: number;
  children:object[];
  isExpanded:boolean;
  cols:object[];
};

@Component({
  selector: 'app-create-measure',
  templateUrl: './create-measure.component.html',
  styleUrls: ['./create-measure.component.css']
})

export class CreateMeasureComponent implements OnInit {

  currentStep = 1;
  selection = [];
  selectionTarget = [];
  selectionPK = [];
  mappings = [];
  matches = [];
  dataAsset = '';
  basic = {};
  rules = '';
  currentDB = '';

  private toasterService: ToasterService;

       next (form) {
           // this.currentStep++;
           // console.log(this.currentStep);
           // var stepSelection = '.formStep[id=step-' + this.currentStep + ']';
           // console.log($(stepSelection));
       }

      prev (form) {
          // this.currentStep--;
          // console.log(this.currentStep);
          // setTimeout(function(){
          // var stepSelection = '.formStep[id=step-' + this.currentStep + ']';
          // }, 0);
      }
      goTo (i) {
        
          this.currentStep = i;
          console.log(this.currentStep);
          var stepSelection = '.formStep[id=step-' + this.currentStep + ']';
          console.log($(stepSelection));
      }
      // submit = function(form) {                
      //         form.$setPristine();
      //         var rule = '';
      //         this.data={
      //           "name":this.basic.name,
      //           "description":this.basic.desc,
      //           "organization":this.basic.system,
      //           "type":this.basic.type,
      //           "source":{
      //               "type":"HIVE",
      //               "version":"1.2",
      //               "config":{
      //                   "database":this.currentNode.parent[0].dbName,
      //                   "table.name":this.currentNode.name,
      //               },
      //           },
      //           "target":{
      //               "type":"HIVE",
      //               "version":"1.2",
      //               "config":{
      //                   "database":this.currentNodeTarget.parent[0].dbName,
      //                   "table.name":this.currentNodeTarget.name,
      //               },
      //           },
      //           "evaluateRule":{
      //               "rules":'',
      //           },
      //           "owner":this.basic.owner,
      //           mappings:[],
      //         };
      //         this.dataAsset = this.currentNodeTarget.name + ',' + this.currentNode.name;
      //         var mappingRule = function(src, tgt, matches) {
      //             var s = src.split('.');
      //             var t = tgt.split('.');
      //             return "$source['" + s[1] + "'] " + matches + " $target['" + t[1] + "']";
      //         }
      //         var rules = this.selectionTarget.map(function(item, i) {
      //             return mappingRule(this.selection[i], item, this.matches[i]);
      //         });
      //         rule = rules.join(" AND ");
      //         this.rules = rule;
      //         this.data.evaluateRule.rules = rule;
      //         for(var i =0; i < this.selectionTarget.length; i ++){
      //           this.data.mappings.push({target:this.selectionTarget[i],
      //                           src:this.mappings[i],
      //                           matchMethod: this.matches[i],
      //                           isPk: (this.selectionPK.indexOf(this.selectionTarget[i])>-1)?true:false});
      //         }
      //         // $('#confirm').show();
      // }

            // save: function() {
            //     var newModel = $config.uri.addModels;
            //     $http.post(newModel, this.data).then(function successCallback(data) {
            //         $('#confirm').on('hidden.bs.modal', function(e) {
            //             $('#confirm').off('hidden.bs.modal');
            //             $location.path('/measures').replace();
            //             this.$apply();
            //         });
            //         $('#confirm').modal('hide');
            //     },function errorCallback(response) {
            //         toaster.pop('error', 'Error when creating measure', response.message);
            //     }
            //     );
            // },
        // }

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
  
  schemaCollection:object[];
  schemaCollectionTarget:object[];


  options: ITreeOptions = {
    displayField: 'name',
    isExpandedField: 'expanded',
    idField: 'id',
    actionMapping: {
      mouse: {
        click: (tree, node, $event) => {
          console.log(tree);
          console.log(node);
          console.log($event);

          if (node.hasChildren) {
            this.currentDB = node.name;
            TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
          }
          else if(node.data.cols)
          {
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
          console.log(tree);
          console.log(node);
          console.log($event);

          if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
          else if(node.data.cols)
          {
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
  constructor(toasterService: ToasterService) {
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
          new_child.cols = this.data[db][i]['sd']['cols'];
        }
        this.nodeList.push(new_node);
    }
    console.log(this.nodeList);
  };
}
