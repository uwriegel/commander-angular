import { DirectoryProcessor, FileItem } from './directory-processor'
import { ColumnsType } from '../columns/columns.component'

export class ExtendedRenameProcessor extends DirectoryProcessor {

    isProcessorFromPath = (path: string) => path ? path == this.path : false
    isProcessor = (item: FileItem) => false

    columns = {
        name: "extendedRename",
        values: [{
                columnsType: ColumnsType.String,
                isSortable: true,
                name: "Name"
            }, {
                columnsType: ColumnsType.String,
                isSortable: true,
                name: "Neuer Name"
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
            }
        ]
    }

    changePath(newPath: string, recentPath?: string): Promise<void> {
        this.path = newPath
        return super.changePath(newPath, recentPath)
    }

    private path = "" 
}