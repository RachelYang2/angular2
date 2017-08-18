import { Component, OnInit } from '@angular/core';
import { TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';

@Component({
  selector: 'app-create-measure',
  templateUrl: './create-measure.component.html',
  styleUrls: ['./create-measure.component.css']
})
export class CreateMeasureComponent implements OnInit {
  nodes = [
    {
      id: 1,
      name: 'root1',
      isExpanded: true,
      children: [
        { id: 2, name: 'child1' },
        { id: 3, name: 'child2' }
      ]
    },
    {
      id: 4,
      name: 'root2',
      isExpanded: true,
      children: [
        { id: 5, name: 'child2.1' },
        {
          id: 6,
          name: 'child2.2',
          children: [
            { id: 7, name: 'subsub' }
          ]
        }
      ]
    }
  ];

  options: ITreeOptions = {
    displayField: 'name',
    isExpandedField: 'expanded',
    // idField: 'uuid',
    actionMapping: {
      mouse: {
        click: (tree, node, $event) => {
          if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
        }
      }
    },
    
    animateExpand: true,
    animateSpeed: 30,
    animateAcceleration: 1.2
  }


  constructor() { }

  ngOnInit() {
  }

}
