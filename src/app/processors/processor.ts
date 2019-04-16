import { Columns } from '../columns/columns.component'
import { ListItem } from '../pipes/virtual-list.pipe'

export interface Processor {
    columns: Columns
    items: ListItem[]
    correctPath(path: string, newPath?: string): string
    getNewPath(path: string, item: ListItem): string
    changePath(newPath: string): Promise<void>
    isProcessor(item: ListItem): boolean
    isProcessorFromPath(path: string): boolean
    processItem(path: string, item: ListItem): boolean
}