import { Body, CACHE_MANAGER, Controller, Delete, Get, Inject, Param, Post, Query, Res } from '@nestjs/common';
import { Public } from 'src/auth/oauth2.strategy';
import NoteCreateDto from 'src/note/dtos/request/NoteCreateDto';
import NoteFilterListDto from './dtos/request/NoteFilterListDto';
import NoteUpdateDto from './dtos/request/NoteUpdateDto';
import PublicNoteDto from './dtos/response/PublicNoteDto';
import { NoteService } from './note.service';
import * as path from 'path';
import { Response } from 'express';
import { NOTE_PUBLISH_FOLDER } from 'src/constants';
import { Cache } from 'cache-manager';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Public()
  @Get()
  getPublishedList(@Query() dto: NoteFilterListDto) {
    return this.noteService.getPublishedList(null, new NoteFilterListDto(dto));
  }

  @Get('all')
  getAll(@Query() dto: NoteFilterListDto) {
    return this.noteService.findAll(null, new NoteFilterListDto(dto));
  }

  @Public()
  @Get('l/:permalink')
  async getPublisedByPermalink(@Param('permalink') permalink: string) {
    const entity = await this.noteService.findPublisedByPermalink(
      null,
      permalink,
    );
    return PublicNoteDto.fromEntity(entity);
  }

  @Post()
  async create(@Body() dto: NoteCreateDto) {
    return this.noteService.create(null, dto);
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    return this.noteService.findIncludeContentById(null, id);
  }

  @Post('/:id')
  async update(@Param('id') id: string, @Body() dto: NoteUpdateDto) {
    return this.noteService.update(null, id, dto);
  }

  @Post('publish/:id')
  async publish(@Param('id') id: string) {
    return this.noteService.publishById(null, id);
  }

  @Public()
  @Get('f/:permalink/:file(*)')
  async static(@Param('permalink') permalink: string,
    @Param('file') filePath: string,
    @Res() res: Response) {
    let isPublished = await this.cacheManager.get<Boolean>(permalink);
    if (isPublished === null || isPublished === undefined) {
      isPublished = await this.noteService.existsPublishedByPermalink(null, permalink);
      await this.cacheManager.set(permalink, isPublished, { ttl: 20 });
    }
    if (!isPublished) {
      res.sendStatus(404);
    } else {
      res.sendFile(path.join(NOTE_PUBLISH_FOLDER, permalink, filePath), (err: any) => {
        if (err) {
          res.sendStatus(404);
        }
      });
    }
  }

  @Delete('h/:id')
  async delete(@Param('id') id: string) {
    await this.noteService.deleteById(null, id);
  }

  @Delete('/:id')
  async softDelete(@Param('id') id: string) {
    await this.noteService.softDeleteById(null, id);
  }
}
