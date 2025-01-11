import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDbService } from './mongodb.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserSeed } from './seeds/user.seed';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [MongoDbService, UserSeed],
  exports: [MongooseModule],
})
export class MongoDBModule {
  // constructor(private readonly userSeed: UserSeed) {
  //   this.userSeed.seed();
  // }
}
