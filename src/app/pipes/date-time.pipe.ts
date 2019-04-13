import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTime'
})
export class DateTimePipe implements PipeTransform {

    transform(date: Date): string {
        return this.dateFormat.format(date) + " " + this.timeFormat.format(date)  
    }
    
    private dateFormat = Intl.DateTimeFormat("de-DE",
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
    
    private timeFormat = Intl.DateTimeFormat("de-DE",
        {
            hour: "2-digit",
            minute: "2-digit"
        })
}
