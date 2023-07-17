// 
// * Enums must be explicitly export and imported where used.
// TypeScript will not throw warnings when export/import are removed,
// but app will crash in runtime.
//

export enum SubTier {
    pro = 'pro',
    plusConference = 'plusConference',
    plusPhone = 'plusPhone',
    basic = 'basic',
}

export enum UpdateSubTier {
    toPro = 'toPro',
    toPlusConference = 'toPlusConference',
    toPlusPhone = 'toPlusPhone',
    toBasic = 'toBasic',
}
