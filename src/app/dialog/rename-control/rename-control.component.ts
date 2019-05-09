import { Component, ViewChild, ElementRef, Input } from '@angular/core'

export interface RenameData {
    isActive: boolean
    numberOfDigits: number
    startingIndex: number
    prefix: string
}

@Component({
    selector: 'app-rename-control',
    templateUrl: './rename-control.component.html',
    styleUrls: ['./rename-control.component.css']
})
export class RenameControlComponent {

    @Input()
    defaultButton: ElementRef

    @Input()
    renameData: RenameData

    @ViewChild("switcher")
    switcher: ElementRef
    
    constructor() { }

    focus() {
        this.switcher.nativeElement.focus()
    }
}
