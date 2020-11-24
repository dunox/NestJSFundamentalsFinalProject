import { Module } from '@nestjs/common';
import { KeynotesService } from './keynotes.service';
import { KeynotesController } from './keynotes.controller';

@Module({
  providers: [KeynotesService],
  controllers: [KeynotesController]
})
export class KeynotesModule {}
