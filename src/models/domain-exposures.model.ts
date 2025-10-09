export interface ExposureDetails {
    id: string;
    title: string;
    entries: number;
    date: string;
    category: string;
    source: string;
    passwordType: string;
    exposedData: string[];
    dateAdded: string;
    sourceURLs: string[];
    sourceFileCount: number;
    domainsAffected: number;
}

export interface Exposure {
    count: number;
    exposures: ExposureDetails[];
    pagingToken: string;
}

export interface UserExposures {
    username: string;
    count: number;
    exposures: ExposureDetails[];
    pagingToken?: string;
}