import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MySQLService } from './mysql.service';
import { User } from './entities/user.entity';
import { UserSeed } from './seeds/user.seed';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        port: Number(configService.get<number>('MYSQL_PORT')),
        username: configService.get<string>('MYSQL_USER'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DATABASE'),
        // entities: [Users], // Register Entitys
        entities: [__dirname + '/entities/*{.ts,.js}'], // Path of entities
        migrations: [__dirname + '/migrations/*{.ts,.js}'], // Path of migrations
        synchronize: false, // Syncs the database schema with entities on startup (should be disabled in production environment)
        migrationsRun: false, // Runs pending migrations on startup
        logging: false, // Enable SQL log (can be disabled in production)
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]), // Make sure entities are imported
  ],
  providers: [MySQLService, UserSeed],
  exports: [TypeOrmModule], // Export TypeOrmModule so it can be used in other modules
})
export class MySQLModule {
  // constructor(private readonly userSeed: UserSeed) {
  //   this.userSeed.seed();
  // }
}
