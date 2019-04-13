import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'fileName'
})
export class FileNamePipe implements PipeTransform {
    transform(name: string): string {
        const pos = name.lastIndexOf('.')
        if (pos == -1)
            return name
        return name.substring(0, pos)    
    }
}
