import { Component } from '@angular/core'

declare var process

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor() {
        if ((<any>window).require) {
            try {
                this.addon = (<any>window).require("extension-fs")
            } catch (error) {
                throw error
            }
        } else 
            console.warn("Could not load electron ipc");             
    }

    async callAddon() {
        let files = await this.addon.getFiles("c:/windows/system32")
        //let files = await addon.getFiles("d:/Test😎😎😎")
    
        const hrstart = process.hrtime()
        //files = await addon.getFiles("c:/windows/system32")
        const diff = process.hrtime(hrstart)
        console.info(`Execution time files (hr): ${(diff[1] / 1000000.0)}`)
    }

    private addon: any
    private test: any 
}