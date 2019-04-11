import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent implements OnInit {

    items = [{
            name: "Affe",
            ext: "txt",
            size: "787"
        }, {
            name: "Schwein",
            ext: "pdf",
            size: "3435"
        }, {
            name: "Hund",
            ext: "cs",
            size: "1223"
        }
    ]

    constructor() { }

    ngOnInit() {
    }

}
