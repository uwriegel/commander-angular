import { Pipe, PipeTransform } from '@angular/core'
import { Observable, Subscriber } from 'rxjs'
import { ScrollbarComponent } from '../scrollbar/scrollbar.component'

export interface ListItem {
    name: string
    isCurrent?: boolean
    isSelected?: boolean
}
@Pipe({
    name: 'virtualList'
})
export class VirtualListPipe implements PipeTransform {
    transform(items: ListItem[], scrollbar: ScrollbarComponent) {
        this.items = items || [] 
        if (!this.scrollbar) {
            this.scrollbar = scrollbar
            this.scrollbar.positionChanged.subscribe((position, _) => {
                this.displayObserver.next(this.getViewItems(position))
            })
        }
        return new Observable<ListItem[]>(displayObserver => {
            this.displayObserver = displayObserver
            let index = this.items.findIndex(n => n.isCurrent) 
            if (index == -1)
                index = 0
            this.scrollbar.setPosition(index)
            this.scrollbar.itemsChanged(this.items.length, null, index)
            this.displayObserver.next(this.getViewItems(this.scrollbar.getPosition()))
        })
    }

    private getViewItems(position: number) {        
        return this.items.filter((_, i) => i >= position && i < this.scrollbar.maxItemsToDisplay + 1 + position)
    }

    private displayObserver: Subscriber<ListItem[]>
    private items: ListItem[]
    private scrollbar: ScrollbarComponent
}