import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-viewer-test',
    templateUrl: './viewer-test.component.html',
    styleUrls: ['./viewer-test.component.css']
})
export class ViewerTestComponent implements OnInit {

    item = ""
    
    constructor() { }

    image1() {
        this.item = "C:\\Users\\uwe.CASERIS\\Pictures\\bild02.jpg"
    }

    image2() {
        this.item = "C:\\Users\\uwe.CASERIS\\Pictures\\bild03.jpg"
    }
    pdf() {
        //this.item = "D:\\Users\\uwe\\Documents\\Bücher\Web\\You Don't Know JS - 2 Scope & Closures.pdf"
        this.item = "D:\\test.pdf"
    }

    ngOnInit() { }
}
