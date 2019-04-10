import { Component, Input } from '@angular/core'
import { ListItem } from 'src/app/pipes/virtual-list.pipe';

@Component({
  selector: '[app-data-template2]',
  templateUrl: './data-template2.component.html',
  styleUrls: ['./data-template2.component.css']
})
export class DataTemplate2Component {

    constructor() { console.log(`Construct #${++this.pos}`)}

    @Input()
    item: ListItem

    private pos = 0
}
