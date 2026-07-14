import { InvalidTimeSlotError } from '../errors/invalid-time-slot.error';

export class TimeSlot {
  constructor(
    readonly start: Date,
    readonly end: Date,
  ) {
    if (start >= end) {
      throw new InvalidTimeSlotError(start, end);
    }
  }

  overlaps(other: TimeSlot): boolean {
    return this.start < other.end && this.end > other.start;
  }
}
