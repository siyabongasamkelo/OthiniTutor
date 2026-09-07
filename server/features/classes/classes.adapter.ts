import { IClass } from "./classes.model.js";

export interface CleanClassResponse {
  classId: string;
  title: string;
  tutorDetails: any;
  subjects: string[];
  grade: number;
  topics: string[];
  scheduledDate: string;
  timeWindow: string;
  duration: string;
  venue: {
    type: string;
    details: string;
  };
  costZar: number;
  additionalNotes?: string;
  gallery: string[];
  reviewStats: {
    averageRating: number;
    totalReviews: number;
  };
}

export class ClassesAdapter {
  static toResponse(classDoc: IClass): CleanClassResponse {
    const totalRating = classDoc.reviews.reduce(
      (acc, curr) => acc + curr.rating,
      0,
    );
    const avg =
      classDoc.reviews.length > 0 ? totalRating / classDoc.reviews.length : 0;

    return {
      classId: (classDoc._id as any).toString(),
      title: classDoc.title,
      tutorDetails: classDoc.tutor,
      subjects: classDoc.subjects,
      grade: classDoc.grade,
      topics: classDoc.topicsCovered,
      scheduledDate: classDoc.date.toISOString().split("T")[0],
      timeWindow: `${classDoc.startTime} - ${classDoc.endTime}`,
      duration: `${classDoc.durationMinutes} Mins`,
      venue: {
        type: classDoc.venueType,
        details: classDoc.locationDetails,
      },
      costZar: classDoc.price,
      additionalNotes: classDoc.notes,
      gallery: classDoc.photos,
      reviewStats: {
        averageRating: parseFloat(avg.toFixed(1)),
        totalReviews: classDoc.reviews.length,
      },
    };
  }

  static toResponseCollection(classes: IClass[]): CleanClassResponse[] {
    return classes.map((c) => this.toResponse(c));
  }
}
