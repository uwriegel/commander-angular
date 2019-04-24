import { Component, ViewChild, OnInit, HostListener, AfterViewInit, Input, ElementRef, NgZone } from '@angular/core'
import { CommanderViewComponent } from '../commander-view/commander-view.component'
import { DialogComponent } from '../dialog/dialog.component'
import { SettingsService } from '../services/settings.service'
const electron = (window as any).require('electron')
const ipcRenderer = electron.ipcRenderer

@Component({
    selector: 'app-commander',
    templateUrl: './commander.component.html',
    styleUrls: ['./commander.component.css']
})
export class CommanderComponent implements OnInit, AfterViewInit {

    @ViewChild("leftView") leftView: CommanderViewComponent
    @ViewChild("rightView") rightView: CommanderViewComponent
    @ViewChild("status") status: ElementRef

    @Input() 
    dialog: DialogComponent

    focusedView: CommanderViewComponent

    isViewVisible = false

    async showDialog(text: string) {
        this.dialog.text = text
        await this.dialog.show()
    }

    checkConflicts(conflicts: any) {
        console.log("CheckConflicts", conflicts)
    }

    constructor(public settings: SettingsService, private zone: NgZone) {
        ipcRenderer.on("preview", (event , on)=> {
            this.zone.run(() => this.isViewVisible = on)
        })
    }

    ngOnInit() { }

    ngAfterViewInit() { 
        setTimeout(() => this.leftView.focus())
    }

    @HostListener('keydown', ['$event']) 
    private onKeydown(evt: KeyboardEvent) {
        switch (evt.which) {
            case 9: // tab
                if (!evt.shiftKey) {
                    if (this.focusedView == this.leftView) 
                        this.rightView.focus()
                    else
                        this.leftView.focus()
                } 
                evt.stopPropagation()
                evt.preventDefault()
                break
        }
    }

    gotFocus(view: CommanderViewComponent) { 
        this.focusedView = view
    }

    onRatioChanged() {
        this.leftView.onResize()
        this.rightView.onResize()
    }
}

