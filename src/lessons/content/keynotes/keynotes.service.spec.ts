import { Test, TestingModule } from '@nestjs/testing';
import { KeynotesService } from './keynotes.service';

describe('KeynotesService', () => {
  let service: KeynotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeynotesService],
    }).compile();

    service = module.get<KeynotesService>(KeynotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
