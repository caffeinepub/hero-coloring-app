import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type ArtworkId = string;
export interface Artwork {
    id: ArtworkId;
    coloredImage: ExternalBlob;
    originalImage: ExternalBlob;
    hero: HeroId;
    name: string;
    artist: Principal;
}
export type HeroId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createArtwork(name: string, originalImage: ExternalBlob, coloredImage: ExternalBlob, hero: HeroId): Promise<ArtworkId>;
    deleteArtwork(artworkId: ArtworkId): Promise<void>;
    getAllArtworks(): Promise<Array<Artwork>>;
    getArtwork(artworkId: ArtworkId): Promise<Artwork>;
    getCallerUserRole(): Promise<UserRole>;
    getHero(heroId: HeroId): Promise<HeroId>;
    getOwnedArtworkIds(): Promise<Array<ArtworkId>>;
    isCallerAdmin(): Promise<boolean>;
}
