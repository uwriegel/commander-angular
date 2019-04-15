import { Columns } from '../columns/columns.component'
import { ListItem } from '../pipes/virtual-list.pipe'

export interface Processor {
    columns: Columns
    items: ListItem[]
    get(path: string): Promise<void>
}