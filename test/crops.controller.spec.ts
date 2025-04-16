import { Test, TestingModule } from '@nestjs/testing';
import { CropsController } from '../src/crops/crops.controller';
import { CropsService } from '../src/crops/crops.service';
import { CreateCropDto } from '../src/crops/dto/create-crop.dto';
import { UpdateCropDto } from '../src/crops/dto/update-crop.dto';

// test/unit/crops.controller.spec.ts

describe('CropsController', () => {
  let controller: CropsController;
  let service: CropsService;

  const mockCropsService = {
    createCrop: jest.fn(),
    findAllCrops: jest.fn(),
    findOneCrop: jest.fn(),
    updateCrop: jest.fn(),
    removeCrop: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropsController],
      providers: [{ provide: CropsService, useValue: mockCropsService }],
    }).compile();

    controller = module.get<CropsController>(CropsController);
    service = module.get<CropsService>(CropsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCrop', () => {
    it('should call service.createCrop with correct data', async () => {
      const dto: CreateCropDto = { name: 'Wheat' };
      mockCropsService.createCrop.mockResolvedValue(dto);

      const result = await controller.createCrop(dto);

      expect(service.createCrop).toHaveBeenCalledWith(dto);
      expect(result).toEqual(dto);
    });
  });

  describe('findAllCrops', () => {
    it('should call service.findAllCrops with correct pagination', async () => {
      const mockResult = [{ id: 1, name: 'Wheat' }];
      mockCropsService.findAllCrops.mockResolvedValue(mockResult);

      const result = await controller.findAllCrops(1, 10);

      expect(service.findAllCrops).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOneCrop', () => {
    it('should call service.findOneCrop with correct ID', async () => {
      const mockResult = { id: 1, name: 'Wheat' };
      mockCropsService.findOneCrop.mockResolvedValue(mockResult);

      const result = await controller.findOneCrop('1');

      expect(service.findOneCrop).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateCrop', () => {
    it('should call service.updateCrop with correct data', async () => {
      const dto: UpdateCropDto = { name: 'Corn' };
      const mockResult = { id: 1, name: 'Corn' };
      mockCropsService.updateCrop.mockResolvedValue(mockResult);

      const result = await controller.updateCrop('1', dto);

      expect(service.updateCrop).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('removeCrop', () => {
    it('should call service.removeCrop with correct ID', async () => {
      mockCropsService.removeCrop.mockResolvedValue(undefined);

      await controller.removeCrop('1');

      expect(service.removeCrop).toHaveBeenCalledWith('1');
    });
  });
});