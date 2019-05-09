import { Component, ViewChild, ElementRef, Input } from '@angular/core'

@Component({
    selector: 'app-rename-control',
    templateUrl: './rename-control.component.html',
    styleUrls: ['./rename-control.component.css']
})
export class RenameControlComponent {

    @Input()
    defaultButton: ElementRef

    @ViewChild("switcher")
    switcher: ElementRef
    
    constructor() { }

    focus() {
        this.switcher.nativeElement.focus()
    }
}
