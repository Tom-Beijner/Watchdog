import fetch from "node-fetch";

export async function hastebin(input: string) {
    if (!input) return console.error("No input specified");
    const res = await fetch("https://hasteb.in/documents", {
        method: "POST",
        body: input,
        headers: {
            "Content-Type": "application/json",
        },
    });
    const json = await res.json();
    return json.key;
}
