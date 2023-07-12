import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserServices } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { UserSchema, User } from './schema/mongo.schema';

@Module({
  controllers: [UserController],
  providers: [UserServices],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({ secret: process.env.SECRET_KEY_JWT }),
  ],
})
export class UserModule {}
