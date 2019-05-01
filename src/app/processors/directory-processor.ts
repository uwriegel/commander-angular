import { Processor } from './processor'
import { ColumnsType, ColumnSortSettings } from '../columns/columns.component'
import { ListItem } from '../pipes/virtual-list.pipe'
import { SettingsService } from '../services/settings.service'
import { sort as sortFileItems } from '../functional/directory-sorting'
import { sendToMainAsync } from '../functional/ipc'
const fs = (window as any).require('fs')
const extfs = (window as any).require('extension-fs')
const getFiles: (path: string)=>Promise<FileItem[]> = extfs.getFiles
const getFileVersion: (file: string)=>Promise<VersionInfo> = extfs.getFileVersion
const getExifDate: (file: string)=>Promise<Date> = extfs.getExifDate
const electron = (window as any).require('electron')

interface VersionInfo {
    major: number
    minor: number
    build: number
    patch: number
}

export interface FileItem extends ListItem{
    isDirectory: boolean
    isHidden: boolean
    isRoot?: boolean
    size: number
    time: Date
    version?: VersionInfo
    isExifDate?: boolean
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

    constructor(private settings: SettingsService) {}

    correctPath(path: string, newPath?: string) {
        path = newPath ? (path == "root" ? newPath : path + '/' + newPath) : path
        return fs.realpathSync(path)
    }

    getNewPath(path: string, item: FileItem) {
        if (item.isRoot)
            return 
        return path ? fs.realpathSync(path + '/' + item.name) : item.name
    }

    async changePath(newPath: string, recentPath?: string): Promise<void> {
        const items = await getFiles(newPath) 
        let dirs = items.filter(n => n.isDirectory)
        let files = items.filter(n => !n.isDirectory)
        if (dirs.length == 0 || dirs[0].name != "..")
            dirs = [ {name: "..", isDirectory: true, isRoot: true  } as FileItem].concat(dirs)
        this.rawItems = dirs.concat(files)

        const getVersion = async function (fileItem: FileItem, file: string) {
            const version = await getFileVersion(file) 
            if (version.major != 0 || version.minor != 0 || version.build != 0 || version.patch != 0)
                fileItem.version = version
        }

        const getExif = async function (fileItem: FileItem, file: string) {
            const exifDate = await getExifDate(file)
            if (exifDate) {
                fileItem.time = exifDate
                fileItem.isExifDate = true
            }
        }

        const getExtendedInfos = async () => {
            for (let i = 0; i < files.length; i++) {        
                const fileItem = files[i]
                const file = newPath + '\\' + fileItem.name
                var checkName = fileItem.name.toLowerCase()
                if (checkName.endsWith(".exe") || checkName.endsWith(".dll")) {
                    await getVersion(fileItem, file)
                }
                else if (checkName.endsWith(".jpg")) {
                    await getExif(fileItem, file)
                }
            }
        }
        getExtendedInfos()

        this.items = this.settings.showHidden ? this.rawItems : this.rawItems.filter(n => !(n as any).isHidden)
        if (this.items.length > 0) {
            if (recentPath) {
                if (recentPath == "root")
                    this.items[0].isCurrent = true    
                else if (recentPath > newPath) {
                    let relativePath = recentPath.substr(newPath.length)
                    if (relativePath.startsWith("\\"))
                        relativePath = relativePath.substr(1)
                    const previousItem = this.items.find(n => n.name == relativePath)
                    previousItem.isCurrent = true
                }
                else
                    this.items[0].isCurrent = true
            }
            else
                this.items[0].isCurrent = true
        }
    }
    
    processItem(path: string, item: FileItem) { 
        if (!item.isDirectory) {
            electron.ipcRenderer.send("open", path + "\\" + item.name)
            return true
        }
        else
            return false
    }

    isProcessor(item: FileItem) {
        return !item.isRoot
    }

    isProcessorFromPath(path: string) {
        return path != "root"
    }
    
    refreshView() {
        this.items = this.sortItems(this.settings.showHidden ? this.rawItems : this.rawItems.filter(n => !(n as any).isHidden))
        if (this.items.length > 0 && !this.items.find(n => n.isCurrent)) {
            const current = this.rawItems.find(n => n.isCurrent)
            current.isCurrent = false
            this.items[0].isCurrent = true
        }
    }

    sort(evt: ColumnSortSettings) {
        this.sorting = evt
        this.refreshView()
    }

    canCreateFolder = () => true
    canRename = () => true

    async createFolder(path: string, folderName: string) {
        await sendToMainAsync("createDirectory", path + '\\' + folderName)
    }

    async rename(path: string, name: string, newName: string) {
        await sendToMainAsync("rename", JSON.stringify({ path: path, name: name, newName: newName }))
    }

    private sortItems(itemsToSort: FileItem[]) {
        if (!this.sorting) 
            return itemsToSort
        let dirs = itemsToSort.filter(n => n.isDirectory)
        let files = sortFileItems(itemsToSort.filter(n => !n.isDirectory), this.sorting)
        return dirs.concat(files)
    }

    private rawItems: FileItem[]
    private sorting: ColumnSortSettings
}
