import {
  Body,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { Public } from '../auth/sso.strategy';
import TodayILearnedCreateDto from './dtos/request/today-i-learn-create.dto';
import TodayILearnedFilterListDto from './dtos/request/today-i-learn-create-filter-list.dto';
import TodayILearnedUpdateDto from './dtos/request/today-i-learn-update.dto';
import PublicTodayILearnedDto from './dtos/response/public-today-i-learned.dto';
import { TodayILearnedService } from './today-i-learned.service';
import { PATH_TIL } from '../constants';
import { Cache } from 'cache-manager';
import TodayILearnedDto from './dtos/response/today-i-learned.dto';

@SkipThrottle()
@Controller(PATH_TIL)
export class TodayILearnedController {
  constructor(
    private readonly todayILearnedService: TodayILearnedService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Public()
  @Throttle(5, 5)
  @Get()
  getPublishedList(@Query() dto: TodayILearnedFilterListDto) {
    return this.todayILearnedService.getPublishedList(null, new TodayILearnedFilterListDto(dto));
  }

  @Get('all')
  getAll(@Query() dto: TodayILearnedFilterListDto) {
    return this.todayILearnedService.findAll(null, new TodayILearnedFilterListDto(dto));
  }

  @Public()
  @Throttle(5, 5)
  @Get('l/:permalink')
  async getPublisedByPermalink(@Param('permalink') permalink: string) {
    const entity = await this.todayILearnedService.findPublishedByPermalink(
      null,
      permalink,
    );
    return PublicTodayILearnedDto.fromEntity(entity);
  }

  @Post()
  async create(@Body() dto: TodayILearnedCreateDto) {
    const newTodayILearned = await this.todayILearnedService.create(null, dto);
    return TodayILearnedDto.fromEntityWithoutContent(newTodayILearned);
  }

  @Post('republish-all')
  async republishAll() {
    return this.todayILearnedService.republishAll(null);
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    const todayILearned = await this.todayILearnedService.findById(null, id);
    return TodayILearnedDto.fromEntity(todayILearned);
  }

  @Post('/:id')
  async update(@Param('id') id: string, @Body() dto: TodayILearnedUpdateDto) {
    return this.todayILearnedService.update(null, id, dto);
  }

  @Post('publish/:id')
  async publish(@Param('id') id: string) {
    return this.todayILearnedService.publishById(null, id);
  }

  @Post('unpublish/:id')
  async unpublish(@Param('id') id: string) {
    return this.todayILearnedService.unpublishById(null, id);
  }

  @Delete('h/:id')
  async delete(@Param('id') id: string) {
    await this.todayILearnedService.deleteById(null, id);
  }

  @Delete('/:id')
  async softDelete(@Param('id') id: string) {
    await this.todayILearnedService.softDeleteById(null, id);
  }

  @Get(':id/preview')
  async preview(@Param('id') id: string) {
    return this.todayILearnedService.getContentPreview(null, id);
  }
}
