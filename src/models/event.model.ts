export type EventModel = {
  id: string;
  title: string;
  date: string;
  time: string;
  imageUrl: string;
  description: string;
  type: string;
  link?: string | null;
  buttonName: string | null
};
