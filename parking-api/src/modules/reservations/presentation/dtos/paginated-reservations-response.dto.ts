import { ApiProperty } from '@nestjs/swagger';
import { ReservationResponseDto } from './reservation-response.dto';

export class PaginatedReservationsResponseDto {
  @ApiProperty({ type: [ReservationResponseDto] })
  data!: ReservationResponseDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;
}
