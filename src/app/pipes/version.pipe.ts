import { Pipe, PipeTransform } from '@angular/core'

interface VersionInfo {
    major: number
    minor: number
    build: number
    patch: number
}

@Pipe({
    name: 'version'
})
export class VersionPipe implements PipeTransform {

    transform(version?: VersionInfo): string {
        return version 
            ? version.major + "."  + version.minor + "." + version.build + "." + version.patch
            : ""
    }
}
