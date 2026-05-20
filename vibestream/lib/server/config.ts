export type JamendoConfig = {
  baseUrl: string;
  clientId: string;
  imageSize: number;
  audioFormat: "mp31" | "mp32" | "ogg" | "flac";
};

export function getJamendoConfig(): JamendoConfig {
  return {
    baseUrl: process.env.JAMENDO_BASE_URL ?? "https://api.jamendo.com/v3.0",
    clientId: process.env.JAMENDO_CLIENT_ID ?? "",
    imageSize: 300,
    audioFormat: "mp31",
  };
}
