import { InvalidTimeSlotError } from '../errors/invalid-time-slot.error';
import { PastTimeSlotError } from '../errors/past-time-slot.error';

export class TimeSlot {
  constructor(
    readonly start: Date,
    readonly end: Date,
  ) {
    if (start >= end) {
      throw new InvalidTimeSlotError(start, end);
    }
  }

  static create(start: Date, end: Date, now: Date = new Date()): TimeSlot {
    const slot = new TimeSlot(start, end);
    if (start < now) {
      throw new PastTimeSlotError(start);
    }
    return slot;
  }

  overlaps(other: TimeSlot): boolean {
    return this.start < other.end && this.end > other.start;
  }
}
