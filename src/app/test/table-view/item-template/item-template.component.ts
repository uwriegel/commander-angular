import { Component, Input } from '@angular/core'
import { ListItem } from 'src/app/pipes/virtual-list.pipe'

@Component({
  selector: '[app-item-template]',
  templateUrl: './item-template.component.html',
  styleUrls: ['./item-template.component.css']
})
export class ItemTemplateComponent  {

    @Input("item")
    item: ListItem

    constructor() { }
}
