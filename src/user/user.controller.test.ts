import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserServices } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from './schema/mongo.schema';
import { CreateUserDto } from './dto/user.dto';

describe('UserController', () => {
  let userController: UserController;
  let userServices: UserServices;
  let userModel: Model<User>;

  beforeEach(async () => {
    
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserServices,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({ secret: process.env.SECRET_KEY_JWT }),
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userServices = moduleRef.get<UserServices>(UserServices);
    userModel = moduleRef.get<Model<User>>(getModelToken(User.name));
  });



  describe('loginUser', () => {

    it('should return a string or an object with loginOk and accessToken', async () => {
      const loginData: Partial<CreateUserDto> = {
        email: 'testuser@example.com',
        password: 'testpassword',
      };

      jest.spyOn(userServices, 'loginUser').mockImplementation(async (loginData) => {
        if (loginData.email === 'testuser@example.com' && loginData.password === 'testpassword') {
          return {
            loginOk: 'Correct login!',
            accessToken: 'testToken',
            id: 'testId',
          };
        } else {
          return 'Incorrect login!';
        }
      });

      const result = await userController.loginUser(loginData);

      expect(result).toEqual({
        loginOk: 'Correct login!',
        accessToken: 'testToken',
        id: 'testId',
      });

      expect(userServices.loginUser).toHaveBeenCalledWith(loginData);
    });
  });


  it('should create a new user and return user data', async () => {
    const createDto: CreateUserDto = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    };

    const expectedUser = {
      name: createDto.name,
      email: createDto.email,
      id: 'testId',
    };

    jest.spyOn(userServices, 'createNewUser').mockResolvedValue(expectedUser);

    const result = await userController.createNewUser(createDto);

    expect(result).toEqual(expectedUser);
    expect(userServices.createNewUser).toHaveBeenCalledWith(createDto);
  });


  it('should return user data for a valid ID', async () => {
    const id = 'testId';
    const expectedUser = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      id: id,
    };

    jest.spyOn(userServices, 'findById').mockResolvedValue(expectedUser);

    const result = await userController.findUserById(id);

    expect(result).toEqual(expectedUser);
    expect(userServices.findById).toHaveBeenCalledWith(id);
  });

  it('should return null for an invalid ID', async () => {
    const id = 'invalidId';
    const expectedUser = null;

    jest.spyOn(userServices, 'findById').mockResolvedValue(expectedUser);

    const result = await userController.findUserById(id);

    expect(result).toEqual(expectedUser);
    expect(userServices.findById).toHaveBeenCalledWith(id);
  });



  it('should delete and return the deleted user', async () => {
    const id = 'testId';
    const expectedUser = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      id,
      password:'testepassword'
    };

    jest.spyOn(userServices, 'findByIdAndDelete').mockResolvedValue(expectedUser);

    const result = await userController.findByIdAndDeleteUser(id);

    expect(result).toEqual(expectedUser);
    expect(userServices.findByIdAndDelete).toHaveBeenCalledWith(id);
  });

  it('should return null for an invalid ID', async () => {
    const id = 'invalidId';
    const expectedUser = null;

    jest.spyOn(userServices, 'findByIdAndDelete').mockResolvedValue(expectedUser);

    const result = await userController.findByIdAndDeleteUser(id);

    expect(result).toEqual(expectedUser);
    expect(userServices.findByIdAndDelete).toHaveBeenCalledWith(id);
  });


});








