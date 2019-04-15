import { Processor } from './processor'
import { DirectoryProcessor } from './directory-processor'
import { ColumnsType } from '../columns/columns.component'
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
    path = ""

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

    async changePath(newPath: string) {
        // path = fs.realpathSync(path)
        // this.path = path
        var result = (await getDrives()).filter(n => n.isMounted)
        if (result.length > 0)
            result[0].isCurrent = true
        this.items =  result
        // const items = await getFiles(path) as any[]
        // this.items = items
        // this.focus()
    }

    getProcessor(newPath: string) {
        return new DirectoryProcessor()
    }
}   