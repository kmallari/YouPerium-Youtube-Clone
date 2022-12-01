export interface NewSubscribe {
    subscriberId : string;
    subscribeeId : string;
}

export interface SubscriptionResponse {
    data : {
        subscription :  boolean
    }
}

export interface Subscription {
    "subscriptionId": string;
    "subscriberId": string;
    "subscribeeId": string;
    "subscribeeChannelName": string;
    "subscribeePicture": string;
    "createdAt": number;
}