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
import { TableViewComponent } from './table-view/table-view.component';
import { ClipHeightPipe } from './pipes/clip-height.pipe';
import { TableViewItemComponent } from './table-view-item/table-view-item.component';
import { FolderComponent } from './icon/folder/folder.component';
import { DriveComponent } from './icon/drive/drive.component';
import { TableViewTestComponent } from './test/table-view-test/table-view-test.component'

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
        TableViewComponent,
        ClipHeightPipe,
        TableViewItemComponent,
        FolderComponent,
        DriveComponent,
        TableViewTestComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
