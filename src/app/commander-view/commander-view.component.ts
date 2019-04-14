import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core'
import { ThemesService } from '../services/themes.service'
import { Columns, ColumnsType } from '../columns/columns.component'
import { ListItem } from '../pipes/virtual-list.pipe';
import { TableViewComponent } from '../table-view/table-view.component';
const fs = (window as any).require('fs')
const extfs = (window as any).require('extension-fs')
interface FileItem {
    displayName: string
    size: number
    time: Date
    isDirectory: boolean
    isHidden: boolean
}
const getFiles: (path: string)=>Promise<FileItem[]> = extfs.getFiles

@Component({
    selector: 'app-commander-view',
    templateUrl: './commander-view.component.html',
    styleUrls: ['./commander-view.component.css']
})
export class CommanderViewComponent implements OnInit {

    @ViewChild(TableViewComponent) 
    private tableView: TableViewComponent

    @Input() 
    id = ""
    
    @Output() 
    private gotFocus: EventEmitter<CommanderViewComponent> = new EventEmitter()    
    
    columns: Columns

    path = ""
    
    get items() { return this._items}
    set items(value: ListItem[]) { 
        //this.undoRestriction()
        this._items = value
    }
    private _items: ListItem[] = []

    constructor(public themes: ThemesService) { }

    ngOnInit() { 
        this.columns = {
            name: "directory",
            values: [{
                    columnsType: ColumnsType.String,
                    isSortable: true,
                    name: "Name"
                }, {
                    columnsType: ColumnsType.String,
                    isSortable: true,
                    name: "Erw."
                }, {
                    columnsType: ColumnsType.Date,
                    isSortable: true,
                    name: "Datum"
                }, {
                    columnsType: ColumnsType.Size,
                    isSortable: true,
                    name: "Größe"
                }, {
                    columnsType: ColumnsType.String,
                    isSortable: true,
                    name: "Version"
                }
            ]
        }
        this.get("c:\\windows")
    }

    onFocusIn() { this.gotFocus.emit(this) }

    focus() { 
        this.tableView.focus() 
    }

    private async get(path: string) {
        path = fs.realpathSync(path)
        this.path = path
        const items = await getFiles(path) as any[]
        this.items = items
        this.focus()
    }

}
