import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@Component({
  selector: 'app-measure',
  templateUrl: './measure.component.html',
  styleUrls: ['./measure.component.css']
})
export class MeasureComponent implements OnInit {
  results:object;

  settings = {
    columns: {
      name: {
        title: 'Measure Name'
      },
      type: {
        title: 'Measure Type'
      },
      description: {
        title: 'Description'
      },
      organization: {
        title: 'Organization'
      }
    },
    actions:{
    	add:false,
    	columnTitle:'',
    	edit:false,
    	delete:false
    },
    hideSubHeader:true

  };
  
  // [
  //   {
  //     id: 1,
  //     name: "Leanne Graham",
  //     username: "Bret",
  //     email: "Sincere@april.biz"
  //   },
  //   // ... other rows here
  //   {
  //     id: 11,
  //     name: "Nicholas DuBuque",
  //     username: "Nicholas.Stanton",
  //     email: "Rey.Padberg@rosamond.biz"
  //   }
  // ];

  constructor(private http:HttpClient) { };

  ngOnInit():void {
  	this.http.get('http://localhost:8080/measures').subscribe(data =>{
  	// this.http.get('../../measures.json').subscribe(data =>{
  		// console.log(data);
  		this.results = data;
  		// console.log(this.results);
  	});
  };
  data = this.results;
}
