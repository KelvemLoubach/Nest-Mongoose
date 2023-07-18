import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthorizationRoute } from './middleware/auth';
import { CreateUserDto } from './dto/user.dto';
import { User } from './schema/mongo.schema';
import { UserServices } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userServices: UserServices) { }

  @Post('login') 
  loginUser(@Body() loginData: Partial<CreateUserDto>): Promise<string | {}> {
    return this.userServices.loginUser(loginData);
  }

  @Post('createaccount')
  createNewUser(@Body() createDto: CreateUserDto): Promise<{ name: string; email: string; id: string } | { emailAlreadyRegistered: string }> {
    return this.userServices.createNewUser(createDto);
  }

  @UseGuards(AuthorizationRoute)
  @Get('/user/:id')
  findUserById(@Param('id') idUser: string): Promise<{ email: string; name: string; id: string } | {userNotFound:string}> {
    return this.userServices.findById(idUser);
  }

  @UseGuards(AuthorizationRoute)
  @Delete('/user/:id')
  findByIdAndDeleteUser(@Param('id') idUserDelete: string): Promise<User | null> {
    return this.userServices.findByIdAndDelete(idUserDelete);
  }

  @UseGuards(AuthorizationRoute)
  @Put('/user/:id')
  updateUser(@Param('id') idUser: string, @Body() newDataUser: Partial<CreateUserDto>): Promise<User | null> {
    return this.userServices.updateUser(idUser, newDataUser);
  }
}
