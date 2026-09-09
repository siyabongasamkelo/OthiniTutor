import { ITutor } from "./tutors.model.js";

export interface ITutorResponse {
  id: string;
  fullName: string;
  email: string;
  contactNo: string;
  whatsAppNo?: string;
  subjects: string[];
  picture?: string;
  nameOfSchool?: string;
  pricing: {
    singleLesson: number;
    monthly: number;
  };
  socials: {
    facebook?: string;
    website?: string;
  };
}

export class TutorAdapter {
  static toClient(tutor: ITutor): ITutorResponse {
    return {
      id: String(tutor._id),
      fullName: tutor.fullName,
      email: tutor.email,
      contactNo: tutor.contactNo,
      whatsAppNo: tutor.whatsAppNo,
      subjects: tutor.subjects,
      picture: tutor.picture,
      nameOfSchool: tutor.nameOfSchool,
      pricing: {
        singleLesson: tutor.pricing.singleLessonPrice,
        monthly: tutor.pricing.monthlyLessonPrice,
      },
      socials: {
        facebook: tutor.socials?.facebookLink,
        website: tutor.socials?.websiteLink,
      },
    };
  }

  static toClientList(tutors: ITutor[]): ITutorResponse[] {
    return tutors.map((tutor) => this.toClient(tutor));
  }
}
