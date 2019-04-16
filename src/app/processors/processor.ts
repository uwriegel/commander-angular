import { Columns } from '../columns/columns.component'
import { ListItem } from '../pipes/virtual-list.pipe'
import { refreshDescendantViews } from '@angular/core/src/render3/instructions';

export interface Processor {
    columns: Columns
    items: ListItem[]
    correctPath(path: string, newPath?: string): string
    getNewPath(path: string, item: ListItem): string
    changePath(newPath: string, recentPath?: string): Promise<void>
    isProcessor(item: ListItem): boolean
    isProcessorFromPath(path: string): boolean
    processItem(path: string, item: ListItem): boolean
    refreshView(): any
}