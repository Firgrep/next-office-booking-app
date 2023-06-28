
export function formatDate(input: string | number | undefined): string | null{
    if (input === undefined ) return null;
    
    const date = new Date(input);
    return date.toLocaleDateString("en-GB", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function extractNumbersFromString(inputString: string): string {
    const matches = inputString.match(/\d+$/g);
    if (matches) {
      return matches[0];
    }
    return '';
}
