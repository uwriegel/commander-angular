import { Component, Input } from '@angular/core'
import { ListItem } from '../pipes/virtual-list.pipe'
import { Columns } from '../columns/columns.component'

@Component({
    selector: '[app-table-view-item]',
    templateUrl: './table-view-item.component.html',
    styleUrls: ['./table-view-item.component.css']
})
export class TableViewItemComponent {
    @Input()
    item: ListItem
    @Input()
    columns: Columns
}
