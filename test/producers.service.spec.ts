import { Test, TestingModule } from '@nestjs/testing';
import { ProducersService } from '../src/producers/producers.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('ProducersService', () => {
  let service: ProducersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    producer: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProducersService>(ProducersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a producer', async () => {
      const dto = { document: '12345678900', name: 'John Doe' };
      mockPrismaService.producer.create.mockResolvedValue(dto);

      const result = await service.create(dto);

      expect(prisma.producer.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(dto);
    });

    it('should throw ConflictException if document already exists', async () => {
      const dto = { document: '12345678900', name: 'John Doe' };
      mockPrismaService.producer.findUnique.mockResolvedValue(dto);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a producer by ID', async () => {
      const producer = { id: '1', document: '12345678900', name: 'John Doe' };
      mockPrismaService.producer.findUnique.mockResolvedValue(producer);

      const result = await service.findOne('1');

      expect(prisma.producer.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { farms: true },
      });
      expect(result).toEqual(producer);
    });

    it('should throw NotFoundException if producer not found', async () => {
      mockPrismaService.producer.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });
});