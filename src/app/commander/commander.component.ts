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
        ipcRenderer.on("properties", () => ipcRenderer.send("showInfo", this.focusedView.currentItem))
        ipcRenderer.on("openWith", () => ipcRenderer.send("openWith", this.focusedView.currentItem))
        ipcRenderer.on("preview", (event, on)=> this.zone.run(() => this.isViewVisible = on))
        ipcRenderer.on("selectAll", () => this.zone.run(() => this.focusedView.selectAllItems(0, false)))
        ipcRenderer.on("deselectAll", () => this.zone.run(() => this.focusedView.selectAllItems(0, true)))
        ipcRenderer.on("refresh", () => this.zone.run(() => this.focusedView.refresh()))
        ipcRenderer.on("adaptPath", () => this.zone.run(() => this.getOtherView().changePath(this.focusedView.path)))
        ipcRenderer.on("createfolder", () => this.zone.run(() => this.focusedView.createfolder()))
        ipcRenderer.on("rename", () => this.zone.run(() => this.focusedView.rename()))
        ipcRenderer.on("deleteFiles", () => this.zone.run(() => this.focusedView.deleteFiles()))
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

    private getOtherView() {
        return this.leftView == this.focusedView ? this.rightView : this.leftView
    }
}

