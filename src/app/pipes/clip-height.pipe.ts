import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'clipHeight'
})
export class ClipHeightPipe implements PipeTransform {

    constructor() {}

    transform(height: number) {
        return `rect(0px, auto, ${height}px, 0px)`
    }
}
