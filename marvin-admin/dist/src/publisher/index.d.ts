interface MarvinNewVideoEvent {
    videoId: number;
}
export declare const setUpConsumer: () => Promise<void>;
export declare const publishMessage: (message: MarvinNewVideoEvent) => Promise<void>;
export {};
