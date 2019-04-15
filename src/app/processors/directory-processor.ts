import { Processor } from './processor'
import { ColumnsType } from '../columns/columns.component'
import { ListItem } from '../pipes/virtual-list.pipe'
const fs = (window as any).require('fs')
const extfs = (window as any).require('extension-fs')
const getFiles: (path: string)=>Promise<ListItem[]> = extfs.getFiles

export class DirectoryProcessor implements Processor {
    path = ""

    items: ListItem[]

    columns = {
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

    async changePath(newPath: string): Promise<void> {
        this.path = this.path ? fs.realpathSync(this.path + '/' + newPath) : newPath
        this.items = await getFiles(this.path) 
        if (this.items.length > 0)
            this.items[0].isCurrent = true
    }
    
    getProcessor(newPath: string) {
        return this
    }
}
