export interface MessageTemplate {
  id: string;
  title: string;
  bodyPt?: string;
  bodyEn?: string;
  tags?: Tag[];
  // createdAt?: string;
  // updatedAt?: string;
}

export interface Tag {
  id: string;
  name: string;
}
