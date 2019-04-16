import { Pipe, PipeTransform } from '@angular/core'
import { ListItem } from './virtual-list.pipe'

@Pipe({
    name: 'fileName'
})
export class FileNamePipe implements PipeTransform {
    transform(item: ListItem): string {
        if ((item as any).isDirectory)
            return item.name
        const pos = item.name.lastIndexOf('.')
        if (pos == -1)
            return item.name
        return item.name.substring(0, pos)    
    }
}
