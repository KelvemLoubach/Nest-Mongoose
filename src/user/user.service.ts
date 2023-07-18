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
    @InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService) { }

  async loginUser(loginDataController: Partial<CreateUserDto>): Promise<{} | string> {

    const { email, password } = loginDataController;
    const emailLowerCase = email.toLowerCase();
    const checkUserAlreadyRegistered = await this.userModel.findOne({ email: emailLowerCase });

    if (!checkUserAlreadyRegistered) {
      return {unregistered:'Unregistered user!'};
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
    return {incorrect:'Incorrect login!'};
  }

  async createNewUser(createUser: CreateUserDto): Promise<{ name: string; email: string; id: string } | { emailAlreadyRegistered: string }> {

    const passwordHash = await bcrypt.hash(createUser.password, 10);
    createUser.email = createUser.email.toLowerCase();

    createUser.password = passwordHash;

    const checkEmailInUse = await this.userModel.findOne({ email: createUser.email })

    if (!checkEmailInUse) {
      const userCreated = await this.userModel.create(createUser);
      const { name, email, id } = userCreated;
      return { name, email, id };
    }

    return { emailAlreadyRegistered: 'E-mail já existe!' }
  }

  async findById(idController: string): Promise<{ email: string; name: string; id: string } | {userNotFound:string}> {

    const user = await this.userModel.findById(idController);

    if(!user){
      return {userNotFound:'User does not exist'}
    }

    const { email, name, id } = user;
    return { email, name, id };
  }

  async findByIdAndDelete(idcontrollerDelete: string): Promise<User | null> {
    return await this.userModel.findByIdAndRemove(idcontrollerDelete).exec();
  }

  async updateUser(idControllerUpdate: string, newDataUser: Partial<CreateUserDto>): Promise<User | null> {

    return await this.userModel.findByIdAndUpdate(idControllerUpdate, newDataUser, { returnDocument: 'after' });

  }
}
