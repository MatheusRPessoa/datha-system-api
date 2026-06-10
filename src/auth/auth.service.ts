import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.validateCredentials(email, password);
    if (!user.ATIVO) {
      throw new UnauthorizedException('Usuário inativo');
    }

    const payload: JwtPayload = { SUB: user.ID, EMAIL: user.EMAIL, ROLE: user.ROLE };

    return {
      succeeded: true,
      data: {
        accessToken: this.jwtService.sign(payload),
        user: {
          ID: user.ID,
          NOME: user.NOME,
          EMAIL: user.EMAIL,
          ROLE: user.ROLE,
          SETOR: user.SETOR,
        },
      },
      message: 'Login realizado com sucesso',
    };
  }

  async me(userId: string) {
    const user = await this.usersService.findForAuth(userId);
    return {
      succeeded: true,
      data: {
        ID: user.ID,
        NOME: user.NOME,
        EMAIL: user.EMAIL,
        ROLE: user.ROLE,
        SETOR: user.SETOR,
      },
      message: 'Usuário autenticado',
    };
  }
}
