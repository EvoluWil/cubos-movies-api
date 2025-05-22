import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { differenceInMinutes } from 'date-fns';
import { User } from 'src/@types/user.type';
import { FindUserDto } from 'src/providers/auth/dto/find-user.dto';
import { defaultPlainToClass } from 'src/utils/default-plain-to-class.util';
import { generateCode } from 'src/utils/generate-code.util';
import { generateHash } from 'src/utils/generate-hash.util';
import { MailTypeEnum } from '../mail/dto/send-mail.dto';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { CredentialDto } from './dto/credentials.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mail: MailService,
  ) {}
  private generateToken(id: string, type: string) {
    const payload = { id, type };
    const token = this.jwtService.sign(payload);
    return token;
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Email ou senha incorretos');
    }

    const passwordMatched = await bcrypt.compare(password, user?.password);

    if (!passwordMatched) {
      throw new BadRequestException('Email ou senha incorretos');
    }

    const token = this.generateToken(user.id, 'USER');

    return { user: defaultPlainToClass(FindUserDto, user), token };
  }

  async signUp(signUpDto: SignUpDto) {
    const {
      profile,
      credentials: { password },
    } = signUpDto;

    const user = await this.prisma.user.findFirst({
      where: {
        email: profile.email,
      },
    });

    if (user) {
      if (user.email === profile.email) {
        throw new BadRequestException('E-mail já cadastrado!');
      }
    }

    const hash = await bcrypt.hash(password, 10);

    await this.prisma.user.create({
      data: {
        ...profile,
        password: hash,
      },
    });

    const emailData = {
      username: profile.name?.split(' ')[0],
    };

    try {
      await this.mail.sendMail({
        to: profile.email,
        subject: 'Boas vindas ao Cubos Movies!',
        type: MailTypeEnum.WELCOME,
        ...emailData,
      });
    } catch (error) {
      return { ok: true, error: error.message };
    }

    return { ok: true };
  }

  async getMe({ id }: User) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('Pessoa não encontrada');
    }

    return defaultPlainToClass(FindUserDto, user);
  }

  async updatePassword(
    { id }: User,
    { password, currentPassword }: UpdatePasswordDto,
  ) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('Pessoa não encontrada');
    }

    const passwordMatched = await bcrypt.compare(
      currentPassword,
      user?.password,
    );

    if (!passwordMatched) {
      throw new BadRequestException('Senha atual incorreta');
    }

    const newPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: newPassword },
    });

    return { ok: true };
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Pessoa não encontrada');
    }

    const code = generateCode();

    const emailData = {
      username: user.name?.split(' ')[0],
      code,
    };

    const result = await this.mail.sendMail({
      to: user.email,
      subject: 'Recuperação de senha',
      type: MailTypeEnum.FORGOT_PASSWORD,
      ...emailData,
    });

    if (!result?.messageId) {
      throw new BadRequestException('Erro ao enviar e-mail');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        codeVerification: code,
        codeCreatedAt: new Date(),
      },
    });

    return { ok: true };
  }

  async validateCode(code: string, { email }: ForgotPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: { codeVerification: code, email },
    });

    if (!user || !user.codeCreatedAt) {
      throw new BadRequestException('Código inválido');
    }

    if (differenceInMinutes(new Date(user?.codeCreatedAt), new Date()) > 60) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { codeVerification: null, codeCreatedAt: null },
      });
      throw new BadRequestException('Código expirado');
    }

    const token = generateHash();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        updatePasswordToken: token,
        updatePasswordTokenCreatedAt: new Date(),
        codeVerification: null,
        codeCreatedAt: null,
      },
    });

    return { token };
  }

  async recoveryPassword(token: string, { password }: CredentialDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        updatePasswordToken: token,
      },
    });

    if (!user || !user.updatePasswordTokenCreatedAt) {
      throw new BadRequestException('Token inválido');
    }

    if (
      differenceInMinutes(
        new Date(user?.updatePasswordTokenCreatedAt),
        new Date(),
      ) > 80
    ) {
      throw new BadRequestException('Token expirado');
    }

    const newPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: { id: user?.id },
      data: {
        password: newPassword,
        updatePasswordToken: null,
        updatePasswordTokenCreatedAt: null,
      },
    });

    return { ok: true };
  }

  async deleteAccount(signInDto: SignInDto) {
    const { user } = await this.signIn(signInDto);
    if (user) {
      await this.prisma.user.delete({
        where: { id: user.id },
      });

      await this.mail.sendMail({
        to: user.email,
        subject: 'Exclusão de conta',
        type: MailTypeEnum.DELETE_ACCOUNT,
        username: user.name?.split(' ')?.[0],
      });

      return { ok: true };
    }
    throw new BadRequestException('Pessoa não encontrada');
  }
}
