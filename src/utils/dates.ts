const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function formatDateBR(date: Date): string {
    const day = DAYS[date.getDay()];
    const num = date.getDate();
    const month = MONTHS[date.getMonth()];
    return `${day}, ${num} de ${month}`;
}

export function toISODate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export function isToday(dateStr: string): boolean {
    return dateStr === toISODate(new Date());
}

export function isPast(dateStr: string): boolean {
    return dateStr < toISODate(new Date());
}

export function getDayOfWeek(date: Date): number {
    return date.getDay();
}
