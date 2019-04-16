import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'extension'
})
export class ExtensionPipe implements PipeTransform {

    transform(name: string): string {
        const pos = name.lastIndexOf('.')
        if (pos == -1 || name == "..")
            return ""
        return name.substring(pos)
    }
}
