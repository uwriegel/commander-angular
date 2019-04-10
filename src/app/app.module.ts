import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component';
import { IconViewComponent } from './test/icon-view/icon-view.component';
import { GetfilesComponent } from './test/getfiles/getfiles.component';
import { ScrollbarComponent } from './scrollbar/scrollbar.component';
import { ColumnsComponent } from './columns/columns.component';
import { VirtualListPipe } from './pipes/virtual-list.pipe';
import { TestColumnsComponent } from './test/columns/columns.component';
import { ScrollbarComponent as TestScrollbarComponent } from './test/scrollbar/scrollbar.component';
import { TemplatesComponent } from './test/datatemplates/templates/templates.component';
import { DataTemplateComponent } from './test/datatemplates/data-template/data-template.component';
import { DataTemplate2Component } from './test/datatemplates/data-template2/data-template2.component';
import { TableViewComponent } from './table-view/table-view.component';
import { ClipHeightPipe } from './pipes/clip-height.pipe';
import { TableViewItemComponent } from './table-view-item/table-view-item.component';
import { TableViewTestItemComponent } from './test/table-view-test-item/table-view-test-item.component';
import { FolderComponent } from './icon/folder/folder.component';
import { DriveComponent } from './icon/drive/drive.component';

@NgModule({
    declarations: [
        AppComponent,
        IconViewComponent,
        GetfilesComponent,
        ScrollbarComponent,
        ColumnsComponent,
        VirtualListPipe,
        TestColumnsComponent,
        TestScrollbarComponent,
        TemplatesComponent,
        DataTemplateComponent,
        DataTemplate2Component,
        TableViewComponent,
        ClipHeightPipe,
        TableViewItemComponent,
        TableViewTestItemComponent,
        FolderComponent,
        DriveComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
