// Notification stubs — safe for Expo Go
// Full implementation can be enabled after testing on a dev build

export async function requestNotificationPermission(): Promise<boolean> {
    console.log('[Notifications] Permission request skipped (stub)');
    return false;
}

export async function scheduleTaskNotifications(
    _taskId: number,
    _taskTitle: string,
    _subjectName: string | undefined,
    _dueDate: string
): Promise<void> {
    console.log('[Notifications] Schedule skipped (stub)');
}

export async function cancelTaskNotifications(_taskId: number): Promise<void> {
    // no-op
}

export function useNotificationListener(): void {
    // no-op
}
