/* eslint-disable @typescript-eslint/no-unused-vars -- want to keep these for now */
export interface ComicSummary {
  resourceURI: string;
  name: string;
}

export interface ComicList {
  available: number;
  returned: number;
  collectionURI: string;
  items: ComicSummary[];
}

export interface StorySummary {
  resourceURI: string;
  name: string;
  type: string;
}

export interface StoryList {
  available: number;
  returned: number;
  collectionURI: string;
  items: StorySummary[];
}

export interface EventSummary {
  resourceURI: string;
  name: string;
}

export interface EventList {
  available: number;
  returned: number;
  collectionURI: string;
  items: EventSummary[];
}

export interface SeriesSummary {
  resourceURI: string;
  name: string;
}

export interface SeriesList {
  available: number;
  returned: number;
  collectionURI: string;
  items: SeriesSummary[];
}

export interface Url {
  type: string;
  url: string;
}

export interface Image {
  path: string;
  extension: string;
}

export interface CharacterSummary {
  resourceURI: string;
  name: string;
}

export interface CharacterList {
  available: number;
  returned: number;
  collectionURI: string;
  items: CharacterSummary[];
}

export interface CreatorSummary {
  resourceURI: string;
  name: string;
  role: string;
}

export interface CreatorList {
  available: number;
  returned: number;
  collectionURI: string;
  items: CreatorSummary[];
}

export interface TextObject {
  type: string;
  language: string;
  text: string;
}

export interface ComicDate {
  type: string;
  date: string;
}

export interface ComicPrice {
  type: string;
  price: number;
}

export interface Comic {
  id: number;
  digitalId: number;
  title: string;
  issueNumber: number;
  variantDescription: string;
  description: string;
  modified: string;
  isbn: string;
  upc: string;
  diamondCode: string;
  ean: string;
  issn: string;
  format: string;
  pageCount: number;
  textObjects: TextObject[];
  resourceURI: string;
  urls: Url[];
  series: SeriesSummary;
  variants: ComicSummary[];
  collections: ComicSummary[];
  collectedIssues: ComicSummary[];
  dates: ComicDate[];
  prices: ComicPrice[];
  thumbnail: Image;
  images: Image[];
  creators: CreatorList;
  characters: CharacterList;
  stories: StoryList;
  events: EventList;
}

export interface ComicDataContainer {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: Comic[];
}

export interface ComicDataWrapper {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  data: ComicDataContainer;
  etag: string;
}

export interface Story {
  id: number;
  title: string;
  description: string;
  resourceURI: string;
  type: string;
  modified: string;
  thumbnail: Image;
  comics: ComicList;
  series: SeriesList;
  events: EventList;
  characters: CharacterList;
  creators: CreatorList;
  originalIssue: ComicSummary;
}

export interface StoryDataContainer {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: Story[];
}

export interface StoryDataWrapper {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  data: StoryDataContainer;
  etag: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  resourceURI: string;
  urls: Url[];
  modified: string;
  start: string;
  end: string;
  thumbnail: Image;
  comics: ComicList;
  stories: StoryList;
  series: SeriesList;
  characters: CharacterList;
  creators: CreatorList;
  next: EventSummary;
  previous: EventSummary;
}

export interface EventDataContainer {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: Event[];
}

export interface EventDataWrapper {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  data: EventDataContainer;
  etag: string;
}

export interface Series {
  id: number;
  title: string;
  description: string;
  resourceURI: string;
  urls: Url[];
  startYear: number;
  endYear: number;
  rating: string;
  modified: string;
  thumbnail: Image;
  comics: ComicList;
  stories: StoryList;
  events: EventList;
  characters: CharacterList;
  creators: CreatorList;
  next: SeriesSummary;
  previous: SeriesSummary;
}

export interface SeriesDataContainer {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: Series[];
}

export interface SeriesDataWrapper {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  data: SeriesDataContainer;
  etag: string;
}

export interface Creator {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  fullName: string;
  modified: string;
  resourceURI: string;
  urls: Url[];
  thumbnail: Image;
  series: SeriesList;
  stories: StoryList;
  comics: ComicList;
  events: EventList;
}

export interface CreatorDataContainer {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: Creator[];
}

export interface CreatorDataWrapper {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  data: CreatorDataContainer;
  etag: string;
}

export interface Character {
  id: number;
  name: string;
  description: string;
  modified: string;
  thumbnail: Image;
  resourceURI: string;
  comics: ComicList;
  series: SeriesList;
  stories: StoryList;
  events: EventList;
  urls: Url[];
}

export interface CharacterDataContainer {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: Character[];
}

export interface CharacterDataWrapper {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  data: CharacterDataContainer;
  etag: string;
}
