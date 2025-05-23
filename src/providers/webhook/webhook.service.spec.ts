import { Test, TestingModule } from '@nestjs/testing';
import { endOfDay, startOfDay } from 'date-fns';
import { MailTypeEnum } from '../mail/dto/send-mail.dto';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { WebhookService } from './webhook.service';

describe('WebhookService', () => {
  let service: WebhookService;
  let prisma: any;
  let mail: any;

  beforeEach(async () => {
    prisma = {
      movie: {
        findMany: jest.fn(),
      },
    };
    mail = {
      sendMail: jest.fn().mockResolvedValue(undefined),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookService,
        { provide: PrismaService, useValue: prisma },
        { provide: MailService, useValue: mail },
      ],
    }).compile();
    service = module.get<WebhookService>(WebhookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send emails for today premieres and return ok', async () => {
    const now = new Date();
    const premieres = [
      {
        title: 'Movie 1',
        createdBy: { email: 'a@a.com', name: 'User' },
      },
      {
        title: 'Movie 2',
        createdBy: { email: 'b@b.com', name: 'User2' },
      },
    ];
    prisma.movie.findMany.mockResolvedValue(premieres);
    const result = await service.dailyTask();
    expect(prisma.movie.findMany).toHaveBeenCalledWith({
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
    expect(mail.sendMail).toHaveBeenCalledTimes(2);
    expect(mail.sendMail).toHaveBeenCalledWith({
      to: 'a@a.com',
      subject: 'Novo filme adicionado',
      type: MailTypeEnum.MOVIE_AVAILABLE,
      username: 'User',
      movieTitle: 'Movie 1',
    });
    expect(result).toEqual({ ok: true });
  });
});
