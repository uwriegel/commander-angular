import { Processor } from './processor'
import { ColumnsType, ColumnSortSettings } from '../columns/columns.component'
import { ListItem } from '../pipes/virtual-list.pipe'
const extfs = (window as any).require('extension-fs')

export enum DriveType {
	UNKNOWN,
	HARDDRIVE,
	ROM,
	REMOVABLE,
	NETWORK
}
export interface DriveItem extends ListItem {
    name: string
    description: string
    size: number
    type: DriveType 
    isMounted: boolean
}
const getDrives: ()=>Promise<DriveItem[]> = extfs.getDrives

export class DriveProcessor implements Processor {
    columns = {
        name: "drive",
        values: [{
                columnsType: ColumnsType.String,
                isSortable: true,
                name: "Name"
            }, {
                columnsType: ColumnsType.String,
                isSortable: true,
                name: "Beschreibung"
            }, {
                columnsType: ColumnsType.Size,
                isSortable: true,
                name: "Größe"
            }
        ]
    }

    items: ListItem[]

    async changePath(newPath: string, recentPath?: string) {
        var result = (await getDrives()).filter(n => n.isMounted)
        if (result.length > 0) {
            if (recentPath) {
                const recentItem = result.find(n => n.name == recentPath)
                if (recentItem)
                    recentItem.isCurrent = true
                else
                    result[0].isCurrent = true
            }
            else
                result[0].isCurrent = true
        }
        this.items =  result
    }

    processItem(path: string, item: ListItem) { return false }

    correctPath(path: string, newPath?: string) {
        return "root"
    }

    getNewPath(path: string, item: ListItem) {
        return "root"
    }

    isProcessor(item: ListItem) {
        return (item as any).isRoot
    }

    isProcessorFromPath(path: string) {
        return path == "root"
    }
    
    refreshView() {}
    
    sort(evt: ColumnSortSettings) {}

    createFolder(folderName: string) {}
}   