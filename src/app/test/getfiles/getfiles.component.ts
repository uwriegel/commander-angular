import { Component } from '@angular/core';
//import {getFiles} from 'extension-fs'
const extfs = (window as any).require('extension-fs')
const process = (window as any).require('process')
const getFiles = extfs.getFiles

@Component({
    selector: 'app-getfiles',
    templateUrl: './getfiles.component.html',
    styleUrls: ['./getfiles.component.css']
})
export class GetfilesComponent {

    constructor() { }

    async onGet(url: string) {
        
        let hrstart = process.hrtime()
        const items = await getFiles(url) as any[]
        let diff = process.hrtime(hrstart)
        console.info(`Execution time getfiles: ${(diff[1] / 1000_000.0)}`)

        hrstart = process.hrtime()
        let displayItems = items.map(n => { return {
            items: [
                this.getNameOnly(n.displayName),
                this.getExtension(n.displayName),
                this.formatDate(n.time),
                this.formatFileSize(n.size)
           ],
           isDirectory: n.isDirectory
        }})

        diff = process.hrtime(hrstart)
        console.info(`Execution time map: ${(diff[1] / 1000_000.0)}`)

        hrstart = process.hrtime()

        let dirs = displayItems.filter(n => n.isDirectory)
        let files = displayItems.filter(n => !n.isDirectory)
        diff = process.hrtime(hrstart)
        console.info(`Execution time separation: ${(diff[1] / 1000_000.0)}`)
        console.log("dirs", dirs)
        console.log("files", files)
    }

    getNameOnly(name:string):string {
        const pos = name.lastIndexOf('.');
        if (pos == -1)
            return name
        return name.substring(0, pos)
    }

    getExtension(name: string): string {
        const pos = name.lastIndexOf('.')
        if (pos == -1)
            return ""
        return name.substring(pos)
    }

    formatFileSize(fileSize: number): string {
        let strNumber = `${fileSize}`
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

    formatDate(dateString: string): string {
        var date = new Date(dateString)
        return this.dateFormat.format(date) + " " + this.timeFormat.format(date)
    }

    dateFormat = Intl.DateTimeFormat("de-DE",
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
    timeFormat = Intl.DateTimeFormat("de-DE",
        {
            hour: "2-digit",
            minute: "2-digit"
        })
}
