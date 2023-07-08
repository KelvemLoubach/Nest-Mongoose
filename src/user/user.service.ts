import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/mongo.schema';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserServices {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async createNewUser(
    createUser: CreateUserDto,
  ): Promise<{ name: string; email: string; id: string } | null> {
    const passwordHash = await bcrypt.hash(createUser.password, 10);
    createUser.password = passwordHash;
    const userCreated = await this.userModel.create(createUser);
    const { name, email, id } = userCreated;
    return { name, email, id };
  }

  async loginUser(loginDataController: Partial<CreateUserDto>) {
    const { email, password } = loginDataController;
    const checkUserAlreadyRegistered = await this.userModel.findOne({ email });

    if (!checkUserAlreadyRegistered) {
      return 'Unregistered user!';
    }

    const isMatchPassword = await bcrypt.compare(
      password,
      checkUserAlreadyRegistered.password,
    );

    if (isMatchPassword) {
      return {
        loginOk: 'Correct login!',
        accessToken: await this.jwtService.signAsync(email),
        id: checkUserAlreadyRegistered.id as string,
      };
    }
    return 'Incorrect login!';
  }

  async findById(
    idController: string,
  ): Promise<{ email: string; name: string; id: string } | null> {
    const user = await this.userModel.findById(idController).exec();
    const { email, name, id } = user;
    return { email, name, id };
  }

  async findByIdAndDelete(idcontrollerDelete: string): Promise<User | null> {
    return await this.userModel.findByIdAndRemove(idcontrollerDelete).exec();
  }

  async updateUser(
    idControllerUpdate: string,
    newDataUser: Partial<CreateUserDto>,
  ): Promise<User | null> {
    return await this.userModel
      .findByIdAndUpdate(idControllerUpdate, newDataUser, {
        returnDocument: 'after',
      })
      .exec();
  }
}
