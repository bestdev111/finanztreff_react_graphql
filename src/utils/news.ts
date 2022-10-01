import moment from 'moment';

export function formatNewsDate(date: any, suffix: string = '', prefix:string = '') {
    let now = moment();
    let current = moment(date);
    let diff = now.diff(current, 'minutes')
    if (diff < 120) {
        return prefix + diff + suffix;
    }
    return current.format("D.M.Y");

}
