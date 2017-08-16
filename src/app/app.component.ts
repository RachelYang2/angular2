import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import 'bootstrap/dist/css/bootstrap.css';

@Component({
  selector: 'app-root',
  template: `
  <nav class="navbar navbar-default navbar-fixed-top" ng-controller="NavCtrl">
    <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a routerLink="/" class="navbar-brand" style="padding-top:5px;padding-bottom:0;"><img src="/assets/img/logo.png" title="Data Quality Service" style="max-height:40px;"/></a>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="navbar-collapse">
            <ul class="nav navbar-nav">
                <li><a routerLink="/" routerLinkActive="active">Health</a></li>
                <li><a routerLink="/measures">Measures</a></li>
                <li><a routerLink="/jobs">Jobs</a></li>
                <li><a routerLink="/mydashboard">My Dashboard</a></li>
            </ul>

            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{{fullName}} <i class="fa fa-user fa-fw"></i><span class="caret"></span></a>
                    <ul class="dropdown-menu dropdown-user">
                        <li><a href="#!/undercons"><i class="fa fa-user fa-fw"></i> User Profile</a></li>
                        <li><a href="#!/undercons"><i class="fa fa-gear fa-fw"></i> Settings</a></li>
                        <li class="divider"></li>
                        <li><a href="/apidocs/index.html" target="_blank"><i class="fa fa-book fa-fw"></i> API DOCs</a></li>
                        <li><a href="https://github.com/eBay/griffin/blob/master/griffin-doc/userguide.md" target="_blank"><i class="fa fa-question-circle fa-fw"></i> User Guide</a></li>
                        <li><a href="mailto://ebay-griffin-devs@googlegroups.com" ><i class="fa fa-envelope fa-fw"></i> Contact us</a></li>
                        <li class="divider"></li>
                        <li><a href="" ng-click="logout()"><i class="fa fa-sign-out fa-fw"></i> Logout</a>
                        </li>
                    </ul>
                </li>
            </ul>

            <form class="navbar-search navbar-right nav navbar-nav" >
                <input id="searchBox" type="text" class="search-query" placeholder="Search..." ng-disabled="!isActive('/measures')&&!isActive('/dataassets')">
            </form>
        </div>
    </div>
  </nav>
    <router-outlet></router-outlet>
  `,
  // templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
}
