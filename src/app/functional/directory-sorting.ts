import { IColumnSortEvent } from '../columns/columns.component'
import { ExtensionPipe } from '../pipes/extension.pipe'
import { FileItem } from '../processors/directory-processor'
import { match } from './match'

const extensionPipe = new ExtensionPipe()

const sortName = (a: FileItem, b: FileItem) => {
    return a.name.localeCompare(b.name)
}

const sortExtension = (a: FileItem, b: FileItem) => {
    return extensionPipe.transform(a).localeCompare(extensionPipe.transform(b))
}

const sortDate = (a: FileItem, b: FileItem) => {
    return a.time.getTime() - b.time.getTime()
}

const sortSize = (a: FileItem, b: FileItem) => {
    return a.size - b.size
}

const sortVersion = (a: FileItem, b: FileItem) => {
    return !a.version && !b.version ? 1
           : a.version && !b.version ? 1
           : !a.version && b.version ? -1
           : a.version.major != b.version.major ? a.version.major - b.version.major
           : a.version.minor != b.version.minor ? a.version.minor - b.version.minor
           : a.version.build != b.version.build ? a.version.build - b.version.build
           : a.version.patch != b.version.patch ? a.version.patch - b.version.patch 
           : 0
}

export const sort = (items: FileItem[], sorting: IColumnSortEvent) => {
    const direction = (n: number) => sorting.ascending ? n : -n
    
    const sort = match({
        0: sortName,
        1: sortExtension,
        2: sortDate,
        3: sortSize,
        4: sortVersion
    }) (sortName) (sorting.index)
    return items.sort((a, b) => (sorting.ascending ? 1 : -1) * sort(a, b))
}