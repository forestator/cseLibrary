import {Pipe, PipeTransform} from '@angular/core';
import {BorrowByComission} from '../models/borrow.model';
import moment from 'moment';

@Pipe({
    name: 'computeStatistics'
})
export class ComputeStatisticsPipe implements PipeTransform {

    transform(gameBorrow: BorrowByComission[]): string {
        if (gameBorrow.length) {
            return this.calculateDaysUsedInYearForArray(gameBorrow);
        } else {
            return '0%';
        }
    }

    private calculateDaysUsedInYear(startDate: string, endDate: string): number {
        const startMoment = moment(startDate, 'DD/MM/YYYY');
        const endMoment = moment(endDate, 'DD/MM/YYYY');

        // Ensure the end date is after the start date
        if (endMoment.isBefore(startMoment)) {
            return 0;
        }

        return endMoment.diff(startMoment, 'days') + 1;
    };

    private calculateDaysUsedInYearForArray(array: BorrowByComission[]): string {
        let totalDaysUsed = 0;

        array.forEach((item) => {
            const daysUsed = this.calculateDaysUsedInYear(item.startDate, item.endDate);
            if (daysUsed > 0) {
                totalDaysUsed += daysUsed;
            }
        });

        return `${Math.round(totalDaysUsed / 365 * 100)}%`;
    };
}
