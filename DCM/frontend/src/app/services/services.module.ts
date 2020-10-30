import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './web/auth.service';
import { HttpClientHelperService } from './web/http-client-helper.service';
import { DashService } from './dash/dash.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    AuthService,
    HttpClientHelperService,
    DashService
  ]
})
export class ServicesModule { }
