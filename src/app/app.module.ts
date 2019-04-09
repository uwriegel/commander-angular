import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { IconViewComponent } from './test/icon-view/icon-view.component';
import { GetfilesComponent } from './test/getfiles/getfiles.component';

@NgModule({
  declarations: [
    AppComponent,
    IconViewComponent,
    GetfilesComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
