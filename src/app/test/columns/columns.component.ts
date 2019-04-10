import { Component } from '@angular/core'
import { IColumnSortEvent, ColumnsType } from '../../columns/columns.component'
import { Columns } from 'src/app/columns/columns.component'

@Component({
    selector: 'app-test-columns',
    templateUrl: './columns.component.html',
    styleUrls: ['./columns.component.css']
})
export class TestColumnsComponent {

    columns: Columns

    onDrive() {
        this.columns = {
            name: "root",
            values: [{
                    columnsType: ColumnsType.String,
                    name: "Name"
                }, {
                    columnsType: ColumnsType.Date,
                    isSortable: true,
                    name: "Beschreibung"
                }, {
                    columnsType: ColumnsType.Size,
                    isSortable: true,
                    name: "Größe"
                }
            ]
        }
    }

    onFiles() {
        this.columns = {
            name: "directory",
            values: [{
                    columnsType: ColumnsType.String,
                    isSortable: true,
                    name: "Name"
                }, {
                    columnsType: ColumnsType.String,
                    isSortable: true,
                    name: "Erw."
                }, {
                    columnsType: ColumnsType.Date,
                    isSortable: true,
                    name: "Datum"
                }, {
                    columnsType: ColumnsType.Size,
                    isSortable: true,
                    name: "Größe"
                }, {
                    columnsType: ColumnsType.String,
                    isSortable: true,
                    name: "Version"
                }
            ]
        }
    }

    onSort(sortEvent: IColumnSortEvent) {
        console.log(`Sorting: ${sortEvent.index} ascending: ${sortEvent.ascending}`)
    }
}

