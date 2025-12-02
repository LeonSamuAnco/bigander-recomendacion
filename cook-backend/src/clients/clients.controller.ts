import {
    Controller,
    Get,
    Put,
    Param,
    Body,
    UseGuards,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClientsService } from './clients.service';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) { }

    @Get(':userId')
    async getClientData(@Param('userId', ParseIntPipe) userId: number) {
        return this.clientsService.getClientData(userId);
    }

    @Get(':userId/favorite-recipes')
    async getFavoriteRecipes(
        @Param('userId', ParseIntPipe) userId: number,
        @Query('limit') limit?: string,
    ) {
        const limitNum = limit ? parseInt(limit, 10) : 20;
        return this.clientsService.getFavoriteRecipes(userId, limitNum);
    }

    @Get(':userId/pantry')
    async getPantry(@Param('userId', ParseIntPipe) userId: number) {
        return this.clientsService.getPantry(userId);
    }

    @Get(':userId/activity')
    async getActivity(
        @Param('userId', ParseIntPipe) userId: number,
        @Query('limit') limit?: string,
    ) {
        const limitNum = limit ? parseInt(limit, 10) : 20;
        return this.clientsService.getActivity(userId, limitNum);
    }

    @Get(':userId/points-history')
    async getPointsHistory(@Param('userId', ParseIntPipe) userId: number) {
        return this.clientsService.getPointsHistory(userId);
    }

    @Get(':userId/stats')
    async getStats(@Param('userId', ParseIntPipe) userId: number) {
        return this.clientsService.getStats(userId);
    }

    @Put(':userId')
    async updateProfile(
        @Param('userId', ParseIntPipe) userId: number,
        @Body() updateData: any,
    ) {
        return this.clientsService.updateProfile(userId, updateData);
    }

    @Put(':userId/update-points')
    async updatePoints(@Param('userId', ParseIntPipe) userId: number) {
        return this.clientsService.updatePoints(userId);
    }
}
