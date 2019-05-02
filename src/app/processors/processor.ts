import { Columns, ColumnSortSettings } from '../columns/columns.component'
import { ListItem } from '../pipes/virtual-list.pipe'
import { IpcRenderer } from 'electron';

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
    sort(evt: ColumnSortSettings): any
    canCreateFolder(): boolean
    canRename(): boolean
    canDelete(): boolean
    createFolder(path: string, folderName: string): Promise<any>
    rename(path: string, name: string, newName: string): Promise<any>
}