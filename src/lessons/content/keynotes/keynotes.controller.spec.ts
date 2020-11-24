import { Test, TestingModule } from '@nestjs/testing';
import { KeynotesController } from './keynotes.controller';

describe('KeynotesController', () => {
  let controller: KeynotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeynotesController],
    }).compile();

    controller = module.get<KeynotesController>(KeynotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
