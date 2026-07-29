import { ApiProperty } from '@nestjs/swagger';

export class ReservationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  spotId!: string;

  @ApiProperty()
  vehicleId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  startTime!: string;

  @ApiProperty()
  endTime!: string;

  @ApiProperty()
  status!: string;
}
