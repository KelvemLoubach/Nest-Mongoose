import {IsEmail, IsNotEmpty, MinLength} from 'class-validator'


export class CreateUserDto {
  @IsNotEmpty({message: 'O nome não pode ser vazio!'})
  name: string;

  @IsEmail(undefined, {message: 'O e-mail informado é inválido!'})
  email: string;

  @MinLength(8, { message: 'A senha deve conter no mínimo oito caracteres!'})
  password: string;
}
