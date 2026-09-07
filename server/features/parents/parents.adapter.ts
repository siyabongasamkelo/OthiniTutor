import { IParent } from "./parents.model.js";

export interface CleanParentResponse {
  id: string;
  name: string;
  email: string;
  contactNo: string;
  whatsappNo: string;
  childrenIds: string[];
}

export class ParentsAdapter {
  static toResponse(parent: IParent): CleanParentResponse {
    return {
      id: (parent._id as any).toString(),
      name: parent.name,
      email: parent.email,
      contactNo: parent.contactNo,
      whatsappNo: parent.whatsappNo || "",
      childrenIds: parent.child.map((c) =>
        c._id ? (c._id as any).toString() : c.toString(),
      ),
    };
  }

  static toResponseCollection(parents: IParent[]): CleanParentResponse[] {
    return parents.map((parent) => this.toResponse(parent));
  }
}
