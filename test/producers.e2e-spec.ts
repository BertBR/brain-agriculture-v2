import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { ProducersService } from '../src/producers/producers.service';

describe('ProducersController (e2e)', () => {
  let app: INestApplication;
  let producerService: ProducersService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    producerService = moduleFixture.get<ProducersService>(ProducersService);

    await app.init();
  });

  afterAll(async () => {
    const prismaService = app.get<PrismaService>(PrismaService);
    await prismaService.$executeRaw`TRUNCATE TABLE "producers" CASCADE`;
    await prismaService.$disconnect();
    await app.close();
  });

  describe('/producers (POST)', () => {
    it('should create a producer', async () => {
      const createProducerDto = { document: '12345678900', name: 'John Doe' };

      const response = await request(app.getHttpServer())
        .post('/producers')
        .send(createProducerDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('John Doe');
    });

    it('should return 409 if document already exists', async () => {
      const createProducerDto = { document: '12345678900', name: 'John Doe' };

      await request(app.getHttpServer())
        .post('/producers')
        .send(createProducerDto)
        .expect(409);

    });
  });

  describe('/producers (GET)', () => {
    it('should return a list of producers', async () => {
      const response = await request(app.getHttpServer())
        .get('/producers')
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});