import { Component, Input } from '@angular/core'
import { ListItem } from 'src/app/pipes/virtual-list.pipe';

@Component({
  selector: '[app-data-template]',
  templateUrl: './data-template.component.html',
  styleUrls: ['./data-template.component.css']
})
export class DataTemplateComponent {

    constructor() { console.log(`Construct #${++this.pos}`)}

    @Input()
    item: ListItem

    private pos = 0
}
