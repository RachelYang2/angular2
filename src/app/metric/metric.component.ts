import { Component, OnInit } from '@angular/core';
import {ChartService} from '../service/chart.service';

@Component({
  selector: 'app-metric',
  templateUrl: './metric.component.html',
  styleUrls: ['./metric.component.css'],
  providers:[ChartService]
})
export class MetricComponent implements OnInit {

  constructor(chartService:ChartService) { }

  ngOnInit() {
  }

}
