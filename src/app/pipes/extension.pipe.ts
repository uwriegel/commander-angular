import { Pipe, PipeTransform } from '@angular/core'
import { ListItem } from './virtual-list.pipe'

@Pipe({
    name: 'extension'
})
export class ExtensionPipe implements PipeTransform {

    transform(item: ListItem): string {
        if ((item as any).isDirectory)
            return ""

        const pos = item.name.lastIndexOf('.')
        if (pos == -1)
            return ""
        return item.name.substring(pos)
    }
}
