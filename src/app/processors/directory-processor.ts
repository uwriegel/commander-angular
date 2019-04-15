import { Processor } from './processor'
import { ColumnsType } from '../columns/columns.component'
import { ListItem } from '../pipes/virtual-list.pipe'
const extfs = (window as any).require('extension-fs')
interface FileItem extends ListItem {
    displayName: string
    size: number
    time: Date
    isDirectory: boolean
    isHidden: boolean
}
const getFiles: (path: string)=>Promise<FileItem[]> = extfs.getFiles

export class DirctoryProcessor implements Processor {
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

    async get(path: string) {
        //path = fs.realpathSync(path)
        // this.path = path
        this.items = await getFiles(path) 
    }
}
