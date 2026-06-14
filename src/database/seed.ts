import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { dataSourceOptions } from '../config/database/data-source';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { BaseEntityStatusEnum } from '../common/enums/base-entity-status.enum';

async function seed() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  const usersRepo = dataSource.getRepository(User);

  const exists = await usersRepo.findOne({
    where: { EMAIL: 'admin@dathasystem.com' },
  });
  if (exists) {
    console.log('Seed já executado, admin já existe.');
    await dataSource.destroy();
    return;
  }

  const admin = usersRepo.create({
    NOME: 'Administrador',
    EMAIL: 'admin@dathasystem.com',
    SENHA: await bcrypt.hash('admin123', 10),
    ROLE: UserRole.ADMIN,
    SETOR: 'TI',
    ATIVO: true,
    STATUS: BaseEntityStatusEnum.ATIVO,
  });

  await usersRepo.save(admin);
  console.log('Admin criado: admin@dathasystem.com / admin123');

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
