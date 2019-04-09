import { Component } from '@angular/core';
//import {getFiles} from 'extension-fs'
const extfs = (window as any).require('extension-fs')
const getFiles = extfs.getFiles

@Component({
    selector: 'app-getfiles',
    templateUrl: './getfiles.component.html',
    styleUrls: ['./getfiles.component.css']
})
export class GetfilesComponent {

    constructor() { }

    async onGet(url: string) {
        var files = await getFiles(url)
        console.log(files)
    }
}
