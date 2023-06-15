

export function formatDate(input: string | number | undefined): string | null{
    if (input === undefined ) return null;
    
    const date = new Date(input);
    return date.toLocaleDateString("en-GB", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};
