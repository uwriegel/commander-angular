import { Pipe, PipeTransform } from '@angular/core'

interface FileItem {
    size: number
    isDirectory: boolean
}

@Pipe({
    name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

    transform(item: FileItem): string {
        if (item.isDirectory)
            return ""
        let strNumber = `${item.size}`
        const thSep = '.'
        if (strNumber.length > 3) {
            var begriff = strNumber
            strNumber = ""
            for (var j = 3; j < begriff.length; j += 3) {
                var extract = begriff.slice(begriff.length - j, begriff.length - j + 3)
                strNumber = thSep + extract + strNumber
            }
            var strfirst = begriff.substr(0, (begriff.length % 3 == 0) ? 3 : (begriff.length % 3))
            strNumber = strfirst + strNumber
        }
        return strNumber
    }
}
