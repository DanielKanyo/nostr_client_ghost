export enum LoadingStateEnum {
    LOADING = "loading",
    IDLE = "idle",
    REDIRECTING = "redirecting",
}

export type LoadingStates = LoadingStateEnum.IDLE | LoadingStateEnum.LOADING | LoadingStateEnum.REDIRECTING;
