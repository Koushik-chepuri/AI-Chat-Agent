export type Sender = "user" | "ai";

export type Message = {
    id: string;
    sender: Sender;
    text: string;
    timestamp: string;
};
