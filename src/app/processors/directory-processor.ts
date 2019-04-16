import { Processor } from './processor'
import { ColumnsType } from '../columns/columns.component'
import { ListItem } from '../pipes/virtual-list.pipe'
const fs = (window as any).require('fs')
const extfs = (window as any).require('extension-fs')
const getFiles: (path: string)=>Promise<FileItem[]> = extfs.getFiles

interface FileItem extends ListItem{
    displayName: string
    size: number
    time: Date
    isDirectory: boolean
    isHidden: boolean
    isRoot?: boolean
}

export class DirectoryProcessor implements Processor {
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

    correctPath(path: string, newPath?: string) {
        path = newPath ? (path == "root" ? newPath : path + '/' + newPath) : path
        return fs.realpathSync(path)
    }

    getNewPath(path: string, item: FileItem) {
        if (item.isRoot)
            return 
        return path ? fs.realpathSync(path + '/' + item.name) : item.name
    }

    async changePath(newPath: string): Promise<void> {
        const items = await getFiles(newPath) 
        let dirs = items.filter(n => n.isDirectory)
        let files = items.filter(n => !n.isDirectory)
        if (dirs.length == 0 || dirs[0].name != "..")
            dirs = [ {name: "..", isDirectory: true, isRoot: true  } as FileItem].concat(dirs)
        this.items = dirs.concat(files)
        if (this.items.length > 0)
            this.items[0].isCurrent = true
    }
    
    processItem(path: string, item: FileItem) { 
        return !item.isDirectory
    }

    isProcessor(item: FileItem) {
        return !item.isRoot
    }

    isProcessorFromPath(path: string) {
        return path != "root"
    }
}
