import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{
    token: string;
    email: string;
    firstName: string;
    lastName: string;
  }> {
    
    const user = await this.usersService.findByEmail(username);
    if (user == null) throw new UnauthorizedException('Invalid username');

    const isMatch = await bcrypt.compare(pass, user?.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { sub: user.id, username: user.email };
    return {
      token: await this.jwtService.signAsync(payload),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
