import { CONFERENCE_ROOM_ID, PHONE_BOOTH_A_ID, PHONE_BOOTH_B_ID } from "~/constants/client/rooms";

export function formatDate(input: string | number | undefined): string | null{
    if (input === undefined ) return null;
    
    const date = new Date(input);
    return date.toLocaleDateString("en-GB", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function extractNumbersFromString(inputString: string): string {
    const matches = inputString.match(/\d+$/g);
    if (matches) {
      return matches[0];
    }
    return '';
}

/**
 * Checks the room ID string against existing IDs and outputs a string description of the room.
 * @param roomId | Room ID
 * @returns string name (capitalized)
 */
export const checkWhatRoom = (roomId: string) => {
    switch (roomId) {
        case CONFERENCE_ROOM_ID:
            return "Conference Room";
        case PHONE_BOOTH_A_ID:
            return "Phone Booth A";
        case PHONE_BOOTH_B_ID:
            return "Phone Booth B";
        default:
            return "Error: No room match";
    }
}
