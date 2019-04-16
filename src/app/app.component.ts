import { Component, ElementRef } from '@angular/core'
import { ThemesService } from './services/themes.service'
import { SettingsService } from './services/settings.service';
const electron = (window as any).require('electron')
const ipcRenderer = electron.ipcRenderer

@Component({
    selector: 'app-root',
    host: {
		"[class.blue-theme]": "themes.theme == 'blue'",
        "[class.light-blue-theme]": "themes.theme == 'lightblue'",
        "[class.dark-theme]": "themes.theme == 'dark'",
        "[class.ubuntu-theme]": "themes.theme == 'ubuntu'"
	},
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private themes: ThemesService, private settings: SettingsService, appElement: ElementRef<HTMLElement>) {
        this.themes.initialize(appElement.nativeElement)

        ipcRenderer.send("getTheme")

        ipcRenderer.on("theme", (event , data)=> {
            this.themes.theme = data
        })

        ipcRenderer.on("showHidden", (event , data)=> {
            this.settings.showHidden = data
        })
    }
}