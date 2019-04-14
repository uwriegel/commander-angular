import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'iconUrl'
})
export class IconUrlPipe implements PipeTransform {

    transform(fileName: string, path: string): string {
        if (fileName.toLowerCase().endsWith(".exe")) 
            return "icon://" + path + '/' + fileName 
        
        const pos = fileName.lastIndexOf('.')
        if (pos == -1)
            return ""
        return "icon://" + fileName.substring(pos + 1)
    }
}
