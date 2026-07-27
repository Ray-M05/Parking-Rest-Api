import { User } from '../../domain/entities/user.entity';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { Email } from '../../domain/value-objects/email.vo';
import { Role } from '../../domain/enums/role.enum';
import { UserOrmEntity } from '../persistence/user.orm-entity';

export class UserMapper {
  static toDomain(orm: UserOrmEntity): User {
    return User.reconstitute(
      UserId.from(orm.id),
      new Email(orm.email),
      orm.passwordHash,
      orm.role as Role,
      orm.active,
    );
  }

  static toPersistence(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = user.id.value;
    orm.email = user.email.value;
    orm.passwordHash = user.getPasswordHash();
    orm.role = user.getRole();
    orm.active = user.isActive();
    return orm;
  }
}
