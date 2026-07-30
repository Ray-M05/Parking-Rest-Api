import { ApiProperty } from '@nestjs/swagger';

export class LogResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'reservation.created' })
  action!: string;

  @ApiProperty({ nullable: true, type: String })
  actorId!: string | null;

  @ApiProperty({ type: Object })
  payload!: Record<string, unknown>;

  @ApiProperty()
  occurredAt!: string;
}
