
export const ROLLING_EMITTENTS: Array<EmittentShort> = [
    {id: 22, name: 'Morgan Stanley'},
    {id: 23, name: 'JP Morgan'},
    {id: 30, name: 'Citi'},
    {id: 26, name: 'Societe Generale'},
    {id: 52, name: 'HSBC'},
    {id: 3, name: 'Vontobel'},
    {id: 46, name: 'BNP Paribas'},
    {id: 4, name: 'UBS'},
    {id: 8, name: 'DZ Bank'},
];

export interface EmittentShort {
    id: number; name: string;
}

export function getRandomEmittent() {
    const idx = Math.round(Math.random() * (ROLLING_EMITTENTS.length-1));
    return ROLLING_EMITTENTS[idx];
}

