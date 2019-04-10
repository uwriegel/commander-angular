import { Component, Input } from '@angular/core'
import { ListItem } from 'src/app/pipes/virtual-list.pipe'

@Component({
    selector: '[app-table-view-test-item]',
    templateUrl: './table-view-test-item.component.html',
    styleUrls: ['./table-view-test-item.component.css']
})
export class TableViewTestItemComponent {
    @Input()
    item: ListItem
}
