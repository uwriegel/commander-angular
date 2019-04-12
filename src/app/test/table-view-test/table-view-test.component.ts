import { Component, OnInit, ViewChild } from '@angular/core'
import { IColumnSortEvent, Columns } from '../../columns/columns.component'
import { ThemesService } from 'src/app/services/themes.service'
import { TableViewComponent as TableView } from '../../table-view/table-view.component'
import { ListItem } from 'src/app/pipes/virtual-list.pipe'
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
    selector: 'app-test-table-view',
    templateUrl: './table-view-test.component.html',
    styleUrls: ['./table-view-test.component.css']
})
export class TableViewTestComponent implements OnInit {

    setColumns(columns: Columns) { 
        this.columns = columns
    }

    // itemsChanged() {
    //     this.zone.run(() => {
    //         const response: Response = JSON.parse(this.commander.getItems())
    //         this.items = response.items
    //     })
    // }

    setCurrentItem(item: string) { }
    
    onCurrentIndexChanged(index: number) {
//        this.commander.setIndex(this.items[index].index)
    }

    itemType = "item"
    //itemType = "testItem"

    columns: Columns
    items: ListItem[] = []

    @ViewChild(TableView) tableView: TableView

    constructor(public themes: ThemesService) { }

    ngOnInit() { 
        this.tableView.focus()
    }

    onRoot() { this.get("root") }
    onC() { this.get("c:\\windows\\..") }
    onSystem32() { this.get("c:\\windows\\system32") }
    onPics() { this.get("c:\\04 - Brayka Bay") }

    async get(path: string) {
        //this.commander.changePath(path)

        const items = await getFiles(path) as any[]
        this.items = items
        this.tableView.focus()
    }

    onSort(sortEvent: IColumnSortEvent) {
        //this.commander.sort(sortEvent.index, sortEvent.ascending)
    }

    createFolder(text: string) {

    }

    copy(targetPath: string, text: string) {

    }
}

