/**
 * Used in Booking and Calendar components
 */
interface DateType {
    justDate: Date | null;
    dateTime: Date | null;
}

interface RoomType {
    roomId: string | null;
}

interface Window {
    modal_confirm_delete: { [key: string]: HTMLDialogElement | undefined };
}

interface SelectedRoomType {
    name: string | undefined;
    interval: number;
    openingTime: number;
    closingTime: number;
}
