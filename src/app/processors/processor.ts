import { Columns } from '../columns/columns.component'
import { ListItem } from '../pipes/virtual-list.pipe'

export interface Processor {
    path: string
    columns: Columns
    items: ListItem[]
    changePath(newPath: string): Promise<void>
    getProcessor(newPath: string): Processor
}