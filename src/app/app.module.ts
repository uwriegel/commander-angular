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
import { FolderComponent } from './icon/folder/folder.component';
import { DriveComponent } from './icon/drive/drive.component';
import { TableViewTestComponent } from './test/table-view-test/table-view-test.component';
import { SanitizePipe } from './pipes/sanitize.pipe';
import { FileNamePipe } from './pipes/file-name.pipe';
import { ExtensionPipe } from './pipes/extension.pipe';
import { DateTimePipe } from './pipes/date-time.pipe';
import { FileSizePipe } from './pipes/file-size.pipe';
import { IconUrlPipe } from './pipes/icon-url.pipe';
import { CommanderViewComponent } from './commander-view/commander-view.component';
import { CommanderViewTestComponent } from './test/commander-view-test/commander-view-test.component';
import { VersionPipe } from './pipes/version.pipe';
import { GridSplitterComponent } from './grid-splitter/grid-splitter.component';
import { GridComponent } from './test/grid-splitter-test/grid-splitter-test.component';
import { DialogComponent } from './dialog/dialog.component';
import { DialogComponent as DialogTestComponent } from './test/dialog-test/dialog-test.component';
import { DefaultButtonDirective } from './directives/default-button.directive';
import { SelectAllDirective } from './directives/select-all.directive';
import { CommanderComponent } from './commander/commander.component';

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
        FolderComponent,
        DriveComponent,
        TableViewTestComponent,
        SanitizePipe,
        FileNamePipe,
        ExtensionPipe,
        DateTimePipe,
        FileSizePipe,
        IconUrlPipe,
        CommanderViewComponent,
        CommanderViewTestComponent,
        VersionPipe,
        GridComponent,
        GridSplitterComponent,
        GridComponent,
        DialogComponent,
        DialogTestComponent,
        DefaultButtonDirective,
        SelectAllDirective,
        CommanderComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
