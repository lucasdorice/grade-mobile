import { subjectColors } from '../theme/colors';

let colorIndex = 0;

export function getNextSubjectColor(): string {
    const color = subjectColors[colorIndex % subjectColors.length];
    colorIndex++;
    return color;
}

export function resetColorIndex(): void {
    colorIndex = 0;
}

export function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
