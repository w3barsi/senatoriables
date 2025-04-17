export type Senator = {
  id: number;
  name: string;
  image?: string;
  rapplerProfile: string | null;
  wikipediaProfile: string | null;
  party: string;
  coalition: string;
  notablePosition: string;
  linkName: string;
  withdrew?: boolean;
};
