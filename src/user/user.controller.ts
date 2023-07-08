import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthorizationRoute } from './middleware/auth';
import { CreateUserDto } from './dto/user.dto';
import { User } from './schema/mongo.schema';
import { UserServices } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userServices: UserServices) {}

  @Post('login')
  async loginUser(
    @Body() loginData: CreateUserDto,
  ): Promise<string | { loginOk: string; accessToken: string }> {
    return await this.userServices.loginUser(loginData);
  }

  @Post('createaccount')
  async createNewUser(
    @Body() createDto: CreateUserDto,
  ): Promise<Partial<User> | null> {
    return await this.userServices.createNewUser(createDto);
  }

  @UseGuards(AuthorizationRoute)
  @Get(':id')
  async findUserById(
    @Param('id') idUser: string,
  ): Promise<{ email: string; name: string; id: string } | null> {
    return this.userServices.findById(idUser);
  }

  @UseGuards(AuthorizationRoute)
  @Delete(':id')
  async findByIdAndDeleteUser(
    @Param('id') idUserDelete: string,
  ): Promise<User | null> {
    return this.userServices.findByIdAndDelete(idUserDelete);
  }

  @UseGuards(AuthorizationRoute)
  @Put(':id')
  async updateUser(
    @Param('id') idUser: string,
    @Body() newDataUser: Partial<CreateUserDto>,
  ): Promise<User | null> {
    return this.userServices.updateUser(idUser, newDataUser);
  }
}
