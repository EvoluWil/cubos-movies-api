import { Injectable } from '@nestjs/common';
import { endOfDay, startOfDay } from 'date-fns';
import { MailTypeEnum } from '../mail/dto/send-mail.dto';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebhookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}
  async dailyTask() {
    const now = new Date();
    const premieres = await this.prisma.movie.findMany({
      where: {
        AND: [
          {
            releaseAt: {
              gte: startOfDay(now),
              lte: endOfDay(now),
            },
          },
          { createdAt: { lte: startOfDay(now) } },
        ],
      },
      include: {
        createdBy: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    const mails = premieres.map((premiere) =>
      this.mail.sendMail({
        to: premiere.createdBy.email,
        subject: 'Novo filme adicionado',
        type: MailTypeEnum.MOVIE_AVAILABLE,
        username: premiere.createdBy.name,
        movieTitle: premiere.title,
      }),
    );

    await Promise.allSettled(mails);

    return { ok: true };
  }
}
