import { Component, OnInit, Input, ElementRef } from '@angular/core'

@Component({
    selector: 'app-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {

    isImage = false
    isFrame = false
    file = ""

    @Input()
    set isViewVisible(value: boolean) {
        this._isViewVisible = value
        this.setItem()
    }
    get isViewVisible() { return this._isViewVisible}
    private _isViewVisible = false
       
    @Input()
    set item(value: string) {
        this._item = value
        this.setItem()
    }
    get item() { return this._item }
    private _item = ""

    constructor(public appElement: ElementRef) { }

    ngOnInit() { }

    private setItem() {
        if (this.item && this.isViewVisible) {
            this.isImage = this.item.toLowerCase().endsWith(".jpg")
                || this.item.toLowerCase().endsWith(".png")
                || this.item.toLowerCase().endsWith(".jpeg")


//            this.isFrame = this.item.toLowerCase().endsWith(".pdf")
            setTimeout(() => this.file = "getfile://" + this.item, 50)
        }
        else {
            this.isImage = null
            this.isFrame = null
            this.file = null
        }
    }
}

