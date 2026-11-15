import galleryRows from "@/data/gallery.json";

export type GalleryCover = "india-mark";

export type GalleryPiece = {
  id: string;
  href: string;
  kind: string;
  span: string;
  title: string;
  lede: string;
  cover: GalleryCover;
};

export const GALLERY = galleryRows as GalleryPiece[];
